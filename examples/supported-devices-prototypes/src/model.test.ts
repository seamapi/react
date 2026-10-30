import { expect, test } from 'vitest'

import type {
  CapabilitySummary,
  DeviceModelSummary,
  IntegrationSupportLevel,
  ProviderRef,
  ProviderRequirements,
} from 'lib/seam/ecosystem/types.js'

import {
  getRequirementKinds,
  getRequirementPills,
  reviewDevice,
} from './model.js'

const legal =
  'To be able to use this system, you will need to first sign an EULA with Salto.'
const combined =
  'To be able to use this system, you will both need to first sign an EULA with Salto and install a Seam bridge to make it cloud-ready.'

test('an EULA is a legal prerequisite, distinct from a subscription', () => {
  expect(getRequirementKinds(legal)).toEqual(['legal'])
  expect(getRequirementKinds('Sign an end-user license agreement.')).toEqual([
    'legal',
  ])
  expect(getRequirementKinds('Sign a waiver.')).toEqual(['legal'])
})

test('a combined provider requirement preserves legal and bridge categories and source copy', () => {
  expect(getRequirementKinds(combined)).toEqual(['legal', 'bridge'])
  expect(
    getRequirementPills({
      requirements: [{ message: combined, capabilities: ['Access codes'] }],
    })
  ).toEqual([
    { label: 'Accessories Required', messages: [combined] },
    { label: 'Legal Requirements', messages: [combined] },
  ])
})

test('existing accessory and subscription categories remain distinct; unknown prose stays explicit', () => {
  expect(getRequirementKinds('A compatible bridge is required.')).toEqual([
    'bridge',
  ])
  expect(getRequirementKinds('An external keypad is required.')).toEqual([
    'keypad',
  ])
  expect(
    getRequirementKinds('A paying Nuki SmartHosting subscription is required.')
  ).toEqual(['subscription'])
  expect(
    getRequirementKinds('Contact the provider to configure access.')
  ).toEqual(['other'])
})

const providerRef = (slug: string): ProviderRef => ({
  provider_id: slug,
  slug,
  display_name: slug,
})

function deviceWithProviders(
  entries: Array<{ slug: string; capabilities: CapabilitySummary[] }>
): DeviceModelSummary {
  return {
    device_model_id: 'lock',
    slug: 'lock',
    display_name: 'Lock',
    description_md: null,
    product_url: null,
    no_longer_sold: false,
    is_forbidden_to_3dparty: false,
    manufacturer: null,
    device_type: null,
    device_type_properties: null,
    featured_image: null,
    variants: [],
    providers: entries.map(({ slug }) => providerRef(slug)),
    capabilities_by_provider: entries.map(({ slug, capabilities }) => ({
      provider: providerRef(slug),
      capabilities,
    })),
    capabilities_stale: false,
    updated_at: '2026-10-01T00:00:00.000Z',
  }
}

const capability = (
  level: IntegrationSupportLevel | null,
  name: CapabilitySummary['name'] = 'can_remotely_unlock'
): CapabilitySummary => ({
  name,
  supported: 'yes',
  integration_support_level: level,
  report: null,
})

const metadata = (
  slug: string,
  levels: Array<IntegrationSupportLevel | null>
): ProviderRequirements => ({
  ...providerRef(slug),
  has_requirements: false,
  requirements_md: null,
  integrations: levels.map((level) => ({ integration_support_level: level })),
})

test('unsupported providers sort last, even when they are the guide provider', () => {
  const model = deviceWithProviders([
    { slug: 'homelok', capabilities: [capability('inquire')] },
    { slug: 'space', capabilities: [capability('stable')] },
    { slug: 'ks', capabilities: [capability('stable')] },
  ])
  const result = reviewDevice(model)
  expect(result.providers.map((provider) => provider.slug)).toEqual([
    'ks',
    'space',
    'homelok',
  ])
  expect(
    result.providers.map((provider) => provider.integrationStatus)
  ).toEqual(['supported', 'supported', 'unsupported'])
  expect(result.providers[2]?.capabilities).toEqual([])
})

test('the supported guide provider precedes other supported providers', () => {
  const model = deviceWithProviders([
    { slug: 'ks', capabilities: [capability('stable')] },
    { slug: 'homelok', capabilities: [capability('inquire')] },
    { slug: 'another-live-provider', capabilities: [capability('beta')] },
  ])
  expect(
    reviewDevice(model).providers.map((provider) => provider.slug)
  ).toEqual(['ks', 'another-live-provider', 'homelok'])
})

test.each<IntegrationSupportLevel>([
  'inquire',
  'unavailable',
  'planned',
  'in-progress',
])('a provider with only %s integrations is not supported', (level) => {
  const model = deviceWithProviders([{ slug: 'cloud', capabilities: [] }])
  expect(
    reviewDevice(model, [metadata('cloud', [level])]).providers[0]
      ?.integrationStatus
  ).toBe('unsupported')
})

test.each<IntegrationSupportLevel>(['stable', 'beta'])(
  'a %s provider stays supported despite missing or stale device capabilities',
  (level) => {
    const model = deviceWithProviders([{ slug: 'cloud', capabilities: [] }])
    model.capabilities_stale = true
    const result = reviewDevice(model, [metadata('cloud', ['inquire', level])])
    expect(result.providers[0]?.integrationStatus).toBe('supported')
    expect(result.providers[0]?.capabilities).toEqual([])
  }
)

test('missing support levels and connectivity alone do not imply an unsupported integration', () => {
  const model = deviceWithProviders([
    { slug: 'empty', capabilities: [] },
    {
      slug: 'connectivity-only',
      capabilities: [capability(null, 'device_connectivity')],
    },
    { slug: 'null-level', capabilities: [capability(null)] },
  ])
  expect(
    reviewDevice(model).providers.every(
      (provider) => provider.integrationStatus === 'unknown'
    )
  ).toBe(true)
  expect(
    reviewDevice(model, [metadata('empty', ['inquire', null])]).providers.find(
      (provider) => provider.slug === 'empty'
    )?.integrationStatus
  ).toBe('unknown')
})

test('stale device reports cannot classify a provider without metadata', () => {
  const model = deviceWithProviders([
    { slug: 'cloud', capabilities: [capability('inquire')] },
  ])
  model.capabilities_stale = true
  expect(reviewDevice(model).providers[0]?.integrationStatus).toBe('unknown')
  expect(
    reviewDevice(model, [metadata('cloud', ['inquire'])]).providers[0]
      ?.integrationStatus
  ).toBe('unsupported')
})
