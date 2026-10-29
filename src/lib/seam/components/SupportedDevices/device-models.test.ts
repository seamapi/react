import { expect, test } from 'vitest'

import type {
  CapabilityName,
  CapabilitySupported,
  DeviceModelSummary,
  EmbedExclusions,
} from 'lib/seam/ecosystem/types.js'

import {
  applyEmbedExclusions,
  filterDeviceModels,
  getCapabilityLabel,
  getCapabilityOptions,
  getCapabilityRequirementMessages,
  getProvidersWithMissingRequirements,
  getSupportedCapabilities,
  groupDeviceModelsByManufacturer,
  resolveProviderRequirements,
  scopeDeviceModelsToProvider,
} from './device-models.js'

const ref = (slug: string): { slug: string; display_name: string } => ({
  slug,
  display_name: slug.toUpperCase(),
})

const deviceModel = ({
  slug,
  manufacturer = 'acme',
  deviceType = 'smartlock',
  capabilities = {},
}: {
  slug: string
  manufacturer?: string | null
  deviceType?: string | null
  capabilities?: Record<
    string,
    Partial<Record<CapabilityName, CapabilitySupported>>
  >
}): DeviceModelSummary => ({
  device_model_id: slug,
  slug,
  display_name: `Model ${slug}`,
  description_md: null,
  product_url: null,
  is_forbidden_to_3dparty: false,
  no_longer_sold: false,
  manufacturer:
    manufacturer == null
      ? null
      : { manufacturer_id: manufacturer, ...ref(manufacturer) },
  device_type:
    deviceType == null
      ? null
      : { device_type_id: deviceType, is_accessory: false, ...ref(deviceType) },
  device_type_properties: null,
  variants: [],
  featured_image: null,
  providers: Object.keys(capabilities).map((p) => ({
    provider_id: p,
    ...ref(p),
  })),
  capabilities_by_provider: Object.entries(capabilities).map(
    ([provider, caps]) => ({
      provider: { provider_id: provider, ...ref(provider) },
      capabilities: Object.entries(caps).map(([name, supported]) => ({
        name: name as CapabilityName,
        supported,
        integration_support_level: 'stable',
        report: { details: `${name} via ${provider}` },
      })),
    })
  ),
  capabilities_stale: false,
  updated_at: '2026-10-01T00:00:00.000Z',
})

const at = (list: DeviceModelSummary[], index: number): DeviceModelSummary => {
  const deviceModel = list[index]
  if (deviceModel == null) throw new Error(`Missing device model ${index}`)
  return deviceModel
}

const noExclusions: EmbedExclusions = {
  excluded_manufacturers: [],
  excluded_device_types: [],
  unsupported_providers: [],
  capability: '',
  capability_exclusions: [],
}

const models = [
  deviceModel({
    slug: 'a',
    manufacturer: 'acme',
    capabilities: {
      cloud: { can_remotely_unlock: 'yes', can_provision_mobile_keys: 'yes' },
      hub: { can_remotely_unlock: 'conditionally' },
    },
  }),
  deviceModel({
    slug: 'b',
    manufacturer: 'bolt',
    capabilities: { hub: { can_remotely_unlock: 'conditionally' } },
  }),
  deviceModel({
    slug: 'c',
    manufacturer: 'acme',
    deviceType: 'thermostat',
    capabilities: { cloud: { can_hvac_heat: 'yes', can_hvac_cool: 'no' } },
  }),
  deviceModel({ slug: 'd', manufacturer: null, deviceType: null }),
]

test('card assignment is independently displayed and filterable without encoding', () => {
  const model = deviceModel({
    slug: 'card-reader',
    capabilities: {
      cloud: {
        can_assign_plastic_cards: 'conditionally',
        can_encode_plastic_cards: 'no',
      },
    },
  })
  expect(
    getSupportedCapabilities(model).map(({ name }) => ({
      name,
      label: getCapabilityLabel(name),
    }))
  ).toEqual([{ name: 'can_assign_plastic_cards', label: 'Assign key cards' }])
  expect(getCapabilityOptions([model]).map(({ value }) => value)).toEqual([
    'can_assign_plastic_cards',
  ])
})

test('applyEmbedExclusions: without exclusions returns the models', () => {
  expect(applyEmbedExclusions(models, null)).toBe(models)
  expect(applyEmbedExclusions(models, noExclusions)).toHaveLength(4)
})

test('applyEmbedExclusions: removes excluded manufacturers and device types', () => {
  const result = applyEmbedExclusions(models, {
    ...noExclusions,
    excluded_manufacturers: ['bolt'],
    excluded_device_types: ['thermostat'],
  })
  expect(result.map((m) => m.slug)).toEqual(['a', 'd'])
})

test('applyEmbedExclusions: removes unsupported providers and models left without one', () => {
  const result = applyEmbedExclusions(models, {
    ...noExclusions,
    unsupported_providers: ['hub'],
  })
  expect(result.map((m) => m.slug)).toEqual(['a', 'c', 'd'])
  expect(result[0]?.providers.map((p) => p.slug)).toEqual(['cloud'])
  expect(
    result[0]?.capabilities_by_provider.map(({ provider }) => provider.slug)
  ).toEqual(['cloud'])
})

test('applyEmbedExclusions: removes the excluded capability from a provider', () => {
  const result = applyEmbedExclusions(models, {
    ...noExclusions,
    capability: 'can_provision_mobile_keys',
    capability_exclusions: [
      {
        device_category: 'smartlock',
        manufacturer_slug: '',
        provider_slug: 'cloud',
      },
    ],
  })
  expect(result.map((m) => m.slug)).toEqual(['a', 'b', 'c', 'd'])
  expect(getSupportedCapabilities(at(result, 0)).map((c) => c.name)).toEqual([
    'can_remotely_unlock',
  ])
})

test('applyEmbedExclusions: removes models excluded for every provider', () => {
  const result = applyEmbedExclusions(models, {
    ...noExclusions,
    capability: 'can_provision_mobile_keys',
    capability_exclusions: [
      {
        device_category: 'smartlock',
        manufacturer_slug: 'acme',
        provider_slug: '',
      },
    ],
  })
  expect(result.map((m) => m.slug)).toEqual(['b', 'c', 'd'])
})

test('getSupportedCapabilities: takes the best support across providers', () => {
  expect(getSupportedCapabilities(at(models, 0))).toEqual([
    {
      name: 'can_remotely_unlock',
      supported: 'yes',
      details: 'can_remotely_unlock via cloud',
      integrationSupportLevel: 'stable',
      requirements: [],
    },
    {
      name: 'can_provision_mobile_keys',
      supported: 'yes',
      details: 'can_provision_mobile_keys via cloud',
      integrationSupportLevel: 'stable',
      requirements: [],
    },
  ])
  expect(getSupportedCapabilities(at(models, 1))).toEqual([
    {
      name: 'can_remotely_unlock',
      supported: 'conditionally',
      details: 'can_remotely_unlock via hub',
      integrationSupportLevel: 'stable',
      requirements: [],
    },
  ])
  expect(getSupportedCapabilities(at(models, 2)).map((c) => c.name)).toEqual([
    'can_hvac_heat',
  ])
})

test('provider scope removes unrelated models, providers and capability badges', () => {
  const result = scopeDeviceModelsToProvider(models, 'hub')
  expect(result.map((m) => m.slug)).toEqual(['a', 'b'])
  expect(result[0]?.providers.map((p) => p.slug)).toEqual(['hub'])
  expect(
    result[0]?.capabilities_by_provider.map((p) => p.provider.slug)
  ).toEqual(['hub'])
  expect(getSupportedCapabilities(at(result, 0)).map((c) => c.name)).toEqual([
    'can_remotely_unlock',
  ])
  expect(scopeDeviceModelsToProvider(models, 'unknown')).toEqual([])
  expect(scopeDeviceModelsToProvider(models, null)).toBe(models)
})

test('conditional requirements include dependency reports without following cycles', () => {
  const model = deviceModel({
    slug: 'lock',
    capabilities: {
      cloud: {
        can_program_online_access_codes: 'conditionally',
        device_connectivity: 'conditionally',
      },
    },
  })
  const caps = model.capabilities_by_provider[0]?.capabilities
  if (caps == null) throw new Error('Missing capabilities')
  const codes = caps.find((c) => c.name === 'can_program_online_access_codes')
  const connectivity = caps.find((c) => c.name === 'device_connectivity')
  if (codes == null || connectivity == null)
    throw new Error('Missing capability')
  codes.report = {
    details: 'Codes need a keypad.',
    requirements: { keypad: { message: 'An external keypad is required.' } },
    dependencies: ['device_connectivity'],
  }
  connectivity.report = {
    details: 'A Wi-Fi bridge is required.',
    dependencies: ['can_program_online_access_codes'],
  }
  expect(
    getSupportedCapabilities(model).find((c) => c.name === codes.name)
      ?.requirements
  ).toEqual(['An external keypad is required.', 'A Wi-Fi bridge is required.'])
})

test('structured dependency requirements replace generic compatibility prose', () => {
  const model = deviceModel({
    slug: 'lock',
    capabilities: {
      cloud: {
        can_remotely_unlock: 'conditionally',
        device_connectivity: 'conditionally',
      },
    },
  })
  const caps = model.capabilities_by_provider[0]?.capabilities
  const unlock = caps?.find((c) => c.name === 'can_remotely_unlock')
  const connectivity = caps?.find((c) => c.name === 'device_connectivity')
  if (unlock == null || connectivity == null)
    throw new Error('Missing capabilities')
  unlock.report = {
    details: 'Check additional requirements.',
    dependencies: ['device_connectivity'],
  }
  connectivity.report = {
    details: 'Device requires a compatible server bridge',
    requirements: { bridge: { message: 'A compatible bridge is required.' } },
  }
  expect(
    getSupportedCapabilities(model).find((c) => c.name === unlock.name)
      ?.requirements
  ).toEqual(['A compatible bridge is required.'])
})

test('requirement messages preserve specific constraints and flag unknown setup', () => {
  const capability = {
    name: 'can_remotely_unlock' as const,
    supported: 'conditionally' as const,
    integrationSupportLevel: 'stable' as const,
    details: 'Only available on firmware 2 or later.',
    requirements: ['A compatible bridge is required.'],
  }
  expect(getCapabilityRequirementMessages(capability)).toEqual([
    'A compatible bridge is required.',
    'Only available on firmware 2 or later.',
  ])
  const generic = {
    ...capability,
    details:
      'This feature is supported by this system and can be used through Seam, but please check additional requirements are met.',
  }
  expect(getCapabilityRequirementMessages(generic)).toEqual([
    'A compatible bridge is required.',
  ])
  expect(
    getCapabilityRequirementMessages({ ...generic, requirements: [] })
  ).toEqual(['Additional setup is required.'])
  expect(
    getCapabilityRequirementMessages({
      ...generic,
      details: 'Report details not found',
      requirements: ['Requirement message not found'],
    })
  ).toEqual(['Additional setup is required.'])
})

test('provider requirements resolve by slug without changing valid messages or source reports', () => {
  const model = deviceModel({
    slug: 'lock',
    capabilities: {
      cloud: {
        can_remotely_unlock: 'conditionally',
        can_remotely_lock: 'conditionally',
      },
      hub: { can_remotely_unlock: 'conditionally' },
    },
  })
  for (const entry of model.capabilities_by_provider) {
    for (const capability of entry.capabilities) {
      capability.report = {
        details: '',
        requirements: {
          provider: {
            message:
              capability.name === 'can_remotely_lock'
                ? 'Keep this specific requirement.'
                : 'Requirement message not found',
          },
          bridge: { message: 'A compatible bridge is required.' },
        },
      }
    }
  }
  expect(getProvidersWithMissingRequirements([model])).toEqual(['cloud', 'hub'])
  const resolved = resolveProviderRequirements(
    [model],
    [
      {
        provider_id: 'cloud',
        ...ref('cloud'),
        has_requirements: true,
        requirements_md: ' A paying SmartHosting subscription is required. ',
      },
    ]
  )
  expect(
    resolved[0]?.capabilities_by_provider[0]?.capabilities[0]?.report
      ?.requirements?.['provider']?.message
  ).toBe('A paying SmartHosting subscription is required.')
  expect(
    resolved[0]?.capabilities_by_provider[0]?.capabilities[1]?.report
      ?.requirements?.['provider']?.message
  ).toBe('Keep this specific requirement.')
  expect(
    resolved[0]?.capabilities_by_provider[1]?.capabilities[0]?.report
      ?.requirements?.['provider']?.message
  ).toBe(
    'Additional integration requirements apply. Check with your integration provider.'
  )
  expect(
    resolved[0]?.capabilities_by_provider[0]?.capabilities[0]?.report
      ?.requirements?.['bridge']?.message
  ).toBe('A compatible bridge is required.')
  expect(
    model.capabilities_by_provider[0]?.capabilities[0]?.report?.requirements?.[
      'provider'
    ]?.message
  ).toBe('Requirement message not found')
  expect(getProvidersWithMissingRequirements(resolved)).toEqual([])
})

test('unavailable or stale capabilities never become supported badges or filters', () => {
  const model = deviceModel({
    slug: 'lock',
    capabilities: { cloud: { can_remotely_unlock: 'yes' } },
  })
  const capability = model.capabilities_by_provider[0]?.capabilities[0]
  if (capability == null) throw new Error('Missing capability')
  for (const level of [
    'planned',
    'in-progress',
    'unavailable',
    'inquire',
    null,
  ] as const) {
    capability.integration_support_level = level
    expect(getSupportedCapabilities(model)).toEqual([])
    expect(
      filterDeviceModels([model], { capability: 'can_remotely_unlock' })
    ).toEqual([])
  }
  capability.integration_support_level = 'beta'
  expect(getSupportedCapabilities(model)[0]?.integrationSupportLevel).toBe(
    'beta'
  )
  model.capabilities_stale = true
  expect(getSupportedCapabilities(model)).toEqual([])
})

test('filterDeviceModels: filters by manufacturer, device type, capability and search', () => {
  const slugs = (filters: Parameters<typeof filterDeviceModels>[1]): string[] =>
    filterDeviceModels(models, filters).map((m) => m.slug)
  expect(slugs({})).toEqual(['a', 'b', 'c', 'd'])
  expect(slugs({ manufacturer: 'acme' })).toEqual(['a', 'c'])
  expect(slugs({ deviceType: 'thermostat' })).toEqual(['c'])
  expect(slugs({ capability: 'can_remotely_unlock' })).toEqual(['a', 'b'])
  expect(slugs({ capability: 'can_hvac_cool' })).toEqual([])
  expect(slugs({ search: 'thermostat' })).toEqual(['c'])
  expect(slugs({ search: 'model unlock' })).toEqual([])
  expect(slugs({ search: 'BOLT' })).toEqual(['b'])
  expect(slugs({ search: 'hub' })).toEqual(['a', 'b'])
})

test('groupDeviceModelsByManufacturer: sorts groups and puts unknown manufacturers last', () => {
  const groups = groupDeviceModelsByManufacturer(models)
  expect(groups.map((g) => g.key)).toEqual(['acme', 'bolt', ''])
  expect(groups[0]?.deviceModels.map((m) => m.slug)).toEqual(['a', 'c'])
})

test('getCapabilityOptions: lists supported capabilities in display order', () => {
  expect(getCapabilityOptions(models).map((o) => o.value)).toEqual([
    'can_remotely_unlock',
    'can_provision_mobile_keys',
    'can_hvac_heat',
  ])
})
