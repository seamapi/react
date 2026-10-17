import type {
  CapabilityDetail,
  CapabilityName,
  DeviceModel,
  EmbedExclusions,
  Manufacturer,
  ManufacturerRef,
} from 'lib/seam/ecosystem/types.js'

export interface DeviceModelFilters {
  manufacturer?: string | null
  deviceType?: string | null
  capability?: string | null
  search?: string
}

export interface SupportedCapability {
  name: CapabilityName
  supported: 'yes' | 'conditionally'
  details: string | null
}

export interface ManufacturerGroup {
  key: string
  manufacturer: ManufacturerRef | null
  deviceModels: DeviceModel[]
}

export interface FilterOption {
  value: string
  label: string
}

/** Capabilities shown as badges, in display order. */
export const capabilityLabels: Partial<Record<CapabilityName, string>> = {
  can_remotely_unlock: 'Remote unlock',
  can_remotely_lock: 'Remote lock',
  can_program_online_access_codes: 'Access codes',
  can_program_offline_access_codes: 'Offline access codes',
  can_provision_mobile_keys: 'Mobile keys',
  can_provision_wallet_keys: 'Wallet keys',
  can_encode_plastic_cards: 'Key cards',
  can_hvac_heat: 'Heat',
  can_hvac_cool: 'Cool',
  can_hvac_auto: 'Heat and cool',
  can_hvac_fan: 'Fan',
  can_program_thermostat_weekly_programs: 'Weekly programs',
  can_monitor: 'Monitoring',
}

const capabilityOrder = Object.keys(capabilityLabels)

export const getCapabilityLabel = (name: string): string =>
  capabilityLabels[name as CapabilityName] ??
  name.replace(/^can_/, '').replaceAll('_', ' ')

/**
 * Removes what a partner's embed key says its widgets must not show
 * (Ecosystem `embed/resolve`): excluded manufacturers and device types,
 * unsupported providers, and the provider combinations excluded for the
 * resolved capability. A model left with no provider is removed.
 */
export const applyEmbedExclusions = (
  deviceModels: DeviceModel[],
  exclusions: EmbedExclusions | null | undefined
): DeviceModel[] => {
  if (exclusions == null) return deviceModels

  const excludedManufacturers = new Set(exclusions.excluded_manufacturers)
  const excludedDeviceTypes = new Set(exclusions.excluded_device_types)
  const unsupportedProviders = new Set(exclusions.unsupported_providers)
  const { capability } = exclusions

  const result: DeviceModel[] = []
  for (const deviceModel of deviceModels) {
    const manufacturerSlug = deviceModel.manufacturer?.slug ?? ''
    const deviceTypeSlug = deviceModel.device_type?.slug ?? ''

    if (excludedManufacturers.has(manufacturerSlug)) continue
    if (excludedDeviceTypes.has(deviceTypeSlug)) continue

    const capabilityExclusions = exclusions.capability_exclusions.filter(
      (exclusion) =>
        capability.length > 0 &&
        exclusion.device_category === deviceTypeSlug &&
        (exclusion.manufacturer_slug === '' ||
          exclusion.manufacturer_slug === manufacturerSlug)
    )

    if (capabilityExclusions.some((e) => e.provider_slug === '')) continue

    const capabilityExcludedProviders = new Set(
      capabilityExclusions.map((e) => e.provider_slug)
    )

    const providers = deviceModel.providers.filter(
      (provider) => !unsupportedProviders.has(provider.slug)
    )

    if (deviceModel.providers.length > 0 && providers.length === 0) continue

    const capabilitiesByProvider = deviceModel.capabilities_by_provider
      .filter(({ provider }) => !unsupportedProviders.has(provider.slug))
      .map((entry) =>
        capabilityExcludedProviders.has(entry.provider.slug)
          ? {
              ...entry,
              capabilities: entry.capabilities.filter(
                (c) => c.name !== capability
              ),
            }
          : entry
      )

    result.push({
      ...deviceModel,
      providers,
      capabilities_by_provider: capabilitiesByProvider,
    })
  }
  return result
}

/** The best support for each capability across the model's providers. */
export const getSupportedCapabilities = (
  deviceModel: DeviceModel
): SupportedCapability[] => {
  const best = new Map<CapabilityName, SupportedCapability>()
  for (const { capabilities } of deviceModel.capabilities_by_provider) {
    for (const capability of capabilities) {
      const supported = toSupported(capability)
      if (supported == null) continue
      const current = best.get(capability.name)
      if (current?.supported === 'yes') continue
      best.set(capability.name, {
        name: capability.name,
        supported,
        details: capability.report?.details ?? null,
      })
    }
  }
  return [...best.values()].sort(
    (a, b) => capabilityRank(a.name) - capabilityRank(b.name)
  )
}

export const supportsCapability = (
  deviceModel: DeviceModel,
  capability: string
): boolean =>
  getSupportedCapabilities(deviceModel).some((c) => c.name === capability)

export const filterDeviceModels = (
  deviceModels: DeviceModel[],
  { manufacturer, deviceType, capability, search = '' }: DeviceModelFilters
): DeviceModel[] => {
  const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return deviceModels.filter((deviceModel) => {
    if (manufacturer != null && deviceModel.manufacturer?.slug !== manufacturer)
      return false
    if (deviceType != null && deviceModel.device_type?.slug !== deviceType)
      return false
    if (capability != null && !supportsCapability(deviceModel, capability))
      return false
    if (terms.length === 0) return true
    const haystack = getSearchText(deviceModel)
    return terms.every((term) => haystack.includes(term))
  })
}

const getSearchText = (deviceModel: DeviceModel): string =>
  [
    deviceModel.display_name,
    deviceModel.slug,
    deviceModel.manufacturer?.display_name,
    deviceModel.device_type?.display_name,
    ...deviceModel.providers.map((p) => p.display_name),
    ...deviceModel.variants.map((v) => v.manufacturer_model_id),
  ]
    .filter((value): value is string => value != null)
    .join(' ')
    .toLowerCase()

export const groupDeviceModelsByManufacturer = (
  deviceModels: DeviceModel[]
): ManufacturerGroup[] => {
  const groups = new Map<string, ManufacturerGroup>()
  for (const deviceModel of deviceModels) {
    const key = deviceModel.manufacturer?.slug ?? ''
    const group = groups.get(key) ?? {
      key,
      manufacturer: deviceModel.manufacturer,
      deviceModels: [],
    }
    group.deviceModels.push(deviceModel)
    groups.set(key, group)
  }
  for (const group of groups.values()) {
    group.deviceModels.sort((a, b) =>
      getDeviceModelName(a).localeCompare(getDeviceModelName(b))
    )
  }
  return [...groups.values()].sort((a, b) => {
    if (a.manufacturer == null) return 1
    if (b.manufacturer == null) return -1
    return getManufacturerName(a.manufacturer).localeCompare(
      getManufacturerName(b.manufacturer)
    )
  })
}

export const getManufacturerOptions = (
  deviceModels: DeviceModel[]
): FilterOption[] =>
  uniqueOptions(
    deviceModels.map((m) =>
      m.manufacturer == null
        ? null
        : {
            value: m.manufacturer.slug,
            label: getManufacturerName(m.manufacturer),
          }
    )
  )

export const getDeviceTypeOptions = (
  deviceModels: DeviceModel[]
): FilterOption[] =>
  uniqueOptions(
    deviceModels.map((m) =>
      m.device_type == null
        ? null
        : { value: m.device_type.slug, label: m.device_type.display_name }
    )
  )

export const getCapabilityOptions = (
  deviceModels: DeviceModel[]
): FilterOption[] => {
  const names = new Set<CapabilityName>()
  for (const deviceModel of deviceModels) {
    for (const { name } of getSupportedCapabilities(deviceModel)) {
      if (capabilityLabels[name] != null) names.add(name)
    }
  }
  return [...names]
    .sort((a, b) => capabilityRank(a) - capabilityRank(b))
    .map((name) => ({ value: name, label: getCapabilityLabel(name) }))
}

export const getDeviceModelName = (deviceModel: DeviceModel): string =>
  deviceModel.display_name ?? deviceModel.slug

export const getManufacturerName = (
  manufacturer: ManufacturerRef | Manufacturer
): string => manufacturer.display_name ?? manufacturer.slug

/** The best available image URL for a device model. */
export const getDeviceModelImageUrl = (
  deviceModel: DeviceModel,
  manufacturer?: Manufacturer | null
): string | null => {
  const image =
    deviceModel.featured_image ??
    deviceModel.variants.flatMap((variant) => variant.images)[0] ??
    manufacturer?.default_device_images.find(
      (d) => d.device_type.slug === deviceModel.device_type?.slug
    )?.asset ??
    null
  if (image == null) return null
  return (
    image.formats.thumbnail?.url ??
    image.formats.small?.url ??
    image.formats.medium?.url ??
    image.url
  )
}

/** The manufacturer's logo, preferring a square logo. */
export const getManufacturerLogoUrl = (
  manufacturer: Manufacturer | null | undefined,
  { mono = false }: { mono?: boolean } = {}
): string | null => {
  if (manufacturer == null) return null
  const kinds = mono
    ? ([
        'square_logo_mono',
        'horizontal_logo_mono',
        'square_logo',
        'horizontal_logo',
      ] as const)
    : ([
        'square_logo',
        'horizontal_logo',
        'square_logo_mono',
        'horizontal_logo_mono',
      ] as const)
  for (const kind of kinds) {
    const logo = manufacturer.logos.find((l) => l.kind === kind)
    if (logo != null) return logo.formats.small?.url ?? logo.url
  }
  return null
}

const toSupported = (
  capability: CapabilityDetail
): SupportedCapability['supported'] | null => {
  if (capability.supported === 'yes') return 'yes'
  if (capability.supported === 'conditionally') return 'conditionally'
  return null
}

const capabilityRank = (name: string): number => {
  const index = capabilityOrder.indexOf(name)
  return index === -1 ? capabilityOrder.length : index
}

const uniqueOptions = (options: Array<FilterOption | null>): FilterOption[] => {
  const byValue = new Map<string, FilterOption>()
  for (const option of options) {
    if (option != null && !byValue.has(option.value)) {
      byValue.set(option.value, option)
    }
  }
  return [...byValue.values()].sort((a, b) => a.label.localeCompare(b.label))
}
