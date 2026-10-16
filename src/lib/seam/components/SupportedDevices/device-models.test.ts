import { expect, test } from 'vitest'

import type {
  CapabilityName,
  CapabilitySupported,
  DeviceModel,
  EmbedExclusions,
} from 'lib/seam/ecosystem/types.js'

import {
  applyEmbedExclusions,
  filterDeviceModels,
  getCapabilityOptions,
  getSupportedCapabilities,
  groupDeviceModelsByManufacturer,
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
}): DeviceModel => ({
  device_model_id: slug,
  slug,
  display_name: `Model ${slug}`,
  description_md: null,
  product_url: null,
  is_forbidden_to_3dparty: false,
  no_longer_sold: false,
  shop_listings: null,
  last_commerce_search_at: null,
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
        capability_id: `${provider}:${name}`,
        name: name as CapabilityName,
        supported,
        integration_support_level: 'stable',
        report: { details: `${name} via ${provider}` },
        report_raw: null,
        locale: 'en',
        computed_at: '2026-10-01T00:00:00.000Z',
      })),
    })
  ),
  capabilities_stale: false,
  created_at: '2026-10-01T00:00:00.000Z',
  updated_at: '2026-10-01T00:00:00.000Z',
})

const at = (list: DeviceModel[], index: number): DeviceModel => {
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
    },
    {
      name: 'can_provision_mobile_keys',
      supported: 'yes',
      details: 'can_provision_mobile_keys via cloud',
    },
  ])
  expect(getSupportedCapabilities(at(models, 1))).toEqual([
    {
      name: 'can_remotely_unlock',
      supported: 'conditionally',
      details: 'can_remotely_unlock via hub',
    },
  ])
  expect(getSupportedCapabilities(at(models, 2)).map((c) => c.name)).toEqual([
    'can_hvac_heat',
  ])
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
