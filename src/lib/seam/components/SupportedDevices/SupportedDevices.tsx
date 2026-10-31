import classNames from 'classnames'
import { useDeferredValue, useMemo, useState } from 'react'

import {
  applyEmbedExclusions,
  capabilityLabels,
  filterDeviceModels,
  getCapabilityOptions,
  getDeviceTypeOptions,
  getManufacturerName,
  getManufacturerOptions,
  getProvidersWithMissingRequirements,
  groupDeviceModelsByManufacturer,
  resolveProviderRequirements,
  scopeDeviceModelsToProvider,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import { FilterSelect } from 'lib/seam/components/SupportedDevices/FilterSelect.js'
import { ManufacturerSection } from 'lib/seam/components/SupportedDevices/ManufacturerSection.js'
import { useEcosystemContext } from 'lib/seam/ecosystem/EcosystemProvider.js'
import type { Manufacturer } from 'lib/seam/ecosystem/types.js'
import { useEcosystemDeviceModelSummaries } from 'lib/seam/ecosystem/use-ecosystem-device-model-summaries.js'
import { useEcosystemManufacturers } from 'lib/seam/ecosystem/use-ecosystem-manufacturers.js'
import { useEcosystemProviderRequirements } from 'lib/seam/ecosystem/use-ecosystem-provider-requirements.js'
import {
  getEmbedKeyManufacturer,
  useEmbedKeyResolution,
} from 'lib/seam/ecosystem/use-embed-key-resolution.js'
import { getEcosystemErrorMessage } from 'lib/ui/ecosystem/errors.js'
import { SearchField } from 'lib/ui/ecosystem/SearchField.js'
import { StateMessage } from 'lib/ui/ecosystem/StateMessage.js'
import {
  type EcosystemTheme,
  getEcosystemThemeClassName,
} from 'lib/ui/ecosystem/theme.js'

import { AccessoryCatalog } from './AccessoryCatalog.js'
import { CapabilityFilter } from './CapabilityFilter.js'
import { CapabilityLegend } from './DeviceRow.js'
import { getAccessorySlugs, presentDevice } from './presentation.js'

export interface SupportedDevicesProps {
  /**
   * DeviceDB manufacturer slug, e.g., `schlage`.
   * Defaults to the manufacturer of a manufacturer embed key.
   */
  manufacturer?: string | undefined
  /** Ecosystem provider slug, e.g., `oracode`. Scopes models and capability summaries. */
  provider?: string | undefined
  /** DeviceDB device type slug, e.g., `smartlock` or `thermostat`. */
  deviceType?: string | undefined
  /** Only devices supporting this capability, e.g., `can_program_online_access_codes`. */
  capability?: string | undefined
  hideSearch?: boolean | undefined
  hideFilters?: boolean | undefined
  hideTitle?: boolean | undefined
  /** Color theme. `auto` follows the visitor's color scheme. */
  theme?: EcosystemTheme | undefined
  className?: string | undefined
}

/**
 * Device models that work with Seam, grouped by manufacturer,
 * with capability checks and expandable hardware and provider requirements.
 */
export function SupportedDevices({
  manufacturer,
  provider,
  deviceType,
  capability,
  hideSearch = false,
  hideFilters = false,
  hideTitle = false,
  theme = 'light',
  className,
}: SupportedDevicesProps): JSX.Element {
  const { embedKey } = useEcosystemContext()
  const explicitManufacturer = normalizeSlug(manufacturer)
  const fixedProvider = normalizeSlug(provider)
  const fixedDeviceType = normalizeSlug(deviceType)
  const fixedCapability = normalizeSlug(capability)

  const {
    embedResolution,
    isError: isResolutionError,
    error: resolutionError,
    refetch: refetchResolution,
  } = useEmbedKeyResolution({ capability: fixedCapability ?? '' })

  const isResolved = embedKey == null || embedResolution != null
  const scopeManufacturer =
    explicitManufacturer ?? getEmbedKeyManufacturer(embedResolution)

  const {
    deviceModels,
    isError: isDeviceModelsError,
    error: deviceModelsError,
    refetch: refetchDeviceModels,
  } = useEcosystemDeviceModelSummaries({
    manufacturer: scopeManufacturer ?? '',
    provider: fixedProvider ?? '',
    deviceType: fixedDeviceType ?? '',
    capability:
      fixedCapability != null && fixedCapability in capabilityLabels
        ? fixedCapability
        : '',
    enabled: (explicitManufacturer != null || isResolved) && !isResolutionError,
  })

  const allowedDeviceModels = useMemo(
    () => applyEmbedExclusions(deviceModels ?? [], embedResolution?.exclusions),
    [deviceModels, embedResolution]
  )

  const missingProviderSlugs = useMemo(
    () => getProvidersWithMissingRequirements(allowedDeviceModels),
    [allowedDeviceModels]
  )
  const providerSlugs = useMemo(
    () =>
      allowedDeviceModels.flatMap((model) =>
        model.providers.map((provider) => provider.slug)
      ),
    [allowedDeviceModels]
  )
  const {
    providers,
    isError: isProvidersError,
    error: providersError,
    refetch: refetchProviders,
  } = useEcosystemProviderRequirements(providerSlugs)
  const resolvedDeviceModels = useMemo(
    () => resolveProviderRequirements(allowedDeviceModels, providers ?? []),
    [allowedDeviceModels, providers]
  )
  const availableDeviceModels = useMemo(
    () => scopeDeviceModelsToProvider(resolvedDeviceModels, fixedProvider),
    [resolvedDeviceModels, fixedProvider]
  )
  const presentedDevices = useMemo(() => {
    const allProvidersById = new Map(
      resolvedDeviceModels.map((model) => [model.device_model_id, model])
    )
    return availableDeviceModels.map((source) =>
      presentDevice(
        source,
        providers ?? [],
        allProvidersById.get(source.device_model_id),
        fixedProvider ?? undefined
      )
    )
  }, [availableDeviceModels, resolvedDeviceModels, providers, fixedProvider])
  const presentedDevicesById = useMemo(
    () =>
      new Map(
        presentedDevices.map((device) => [
          device.source.device_model_id,
          device,
        ])
      ),
    [presentedDevices]
  )
  const accessorySlugs = useMemo(
    () => getAccessorySlugs(presentedDevices),
    [presentedDevices]
  )

  const manufacturerSlugs = useMemo(
    () =>
      availableDeviceModels
        .map((m) => m.manufacturer?.slug)
        .filter((slug): slug is string => slug != null),
    [availableDeviceModels]
  )

  const { manufacturers } = useEcosystemManufacturers({
    slugs: manufacturerSlugs,
    enabled: manufacturerSlugs.length > 0,
  })

  const manufacturersBySlug = useMemo(
    () =>
      new Map<string, Manufacturer>(
        (manufacturers ?? []).map((m) => [m.slug, m])
      ),
    [manufacturers]
  )

  const [searchValue, setSearchValue] = useState('')
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    string | null
  >(null)
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(
    null
  )
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const search = useDeferredValue(searchValue)

  const filteredDeviceModels = useMemo(
    () =>
      selectedCapabilities.reduce(
        (models, selected) =>
          filterDeviceModels(models, { capability: selected }),
        filterDeviceModels(availableDeviceModels, {
          manufacturer: scopeManufacturer ?? selectedManufacturer,
          deviceType: fixedDeviceType ?? selectedDeviceType,
          capability: fixedCapability,
          search,
        })
      ),
    [
      availableDeviceModels,
      scopeManufacturer,
      selectedManufacturer,
      fixedDeviceType,
      selectedDeviceType,
      fixedCapability,
      selectedCapabilities,
      search,
    ]
  )

  const groups = useMemo(
    () => groupDeviceModelsByManufacturer(filteredDeviceModels),
    [filteredDeviceModels]
  )

  const manufacturerOptions = useMemo(
    () => getManufacturerOptions(availableDeviceModels),
    [availableDeviceModels]
  )
  const deviceTypeOptions = useMemo(
    () => getDeviceTypeOptions(availableDeviceModels),
    [availableDeviceModels]
  )
  const capabilityOptions = useMemo(
    () => getCapabilityOptions(availableDeviceModels),
    [availableDeviceModels]
  )

  const showManufacturerFilter =
    scopeManufacturer == null && manufacturerOptions.length > 1
  const showDeviceTypeFilter =
    fixedDeviceType == null && deviceTypeOptions.length > 1
  const showCapabilityFilter =
    fixedCapability == null && capabilityOptions.length > 1

  const hasUserFilters =
    searchValue.trim().length > 0 ||
    selectedManufacturer != null ||
    selectedDeviceType != null ||
    selectedCapabilities.length > 0

  const resetFilters = (): void => {
    setSearchValue('')
    setSelectedManufacturer(null)
    setSelectedDeviceType(null)
    setSelectedCapabilities([])
  }

  const areRequirementsMissing = missingProviderSlugs.length > 0
  const isError =
    isResolutionError ||
    isDeviceModelsError ||
    (areRequirementsMissing && isProvidersError)
  const isLoading =
    !isError &&
    (!isResolved ||
      deviceModels == null ||
      (areRequirementsMissing && providers == null))

  const scopedManufacturerName =
    scopeManufacturer == null
      ? null
      : getScopedManufacturerName(
          scopeManufacturer,
          manufacturersBySlug.get(scopeManufacturer),
          availableDeviceModels[0]?.manufacturer?.display_name
        )

  const title =
    scopedManufacturerName == null
      ? t.title
      : t.manufacturerTitle(scopedManufacturerName)

  const content = (() => {
    if (isError) {
      const { message, canRetry } = getEcosystemErrorMessage(
        isResolutionError
          ? resolutionError
          : isDeviceModelsError
            ? deviceModelsError
            : providersError,
        t.error
      )
      return (
        <StateMessage
          role='alert'
          {...(canRetry
            ? {
                actionLabel: t.retry,
                onAction: () => {
                  if (isResolutionError) void refetchResolution()
                  if (isDeviceModelsError) void refetchDeviceModels()
                  if (isProvidersError) void refetchProviders()
                },
              }
            : {})}
        >
          {message}
        </StateMessage>
      )
    }

    if (isLoading) return <LoadingRows />

    if (availableDeviceModels.length === 0) {
      return <StateMessage>{t.noDevices}</StateMessage>
    }

    if (filteredDeviceModels.length === 0) {
      return (
        <StateMessage
          {...(hasUserFilters
            ? { actionLabel: t.clearFilters, onAction: resetFilters }
            : {})}
        >
          {hasUserFilters ? t.noMatches : t.noDevices}
        </StateMessage>
      )
    }

    return (
      <div className='seam-supported-devices-sections'>
        {groups.map((group) => (
          <ManufacturerSection
            key={group.key}
            devices={group.deviceModels.flatMap((model) => {
              const device = presentedDevicesById.get(model.device_model_id)
              return device == null ? [] : [device]
            })}
            manufacturer={manufacturersBySlug.get(group.key) ?? null}
            collapsible={groups.length > 1}
          />
        ))}
      </div>
    )
  })()

  const showFilters =
    !hideFilters &&
    (showManufacturerFilter || showDeviceTypeFilter || showCapabilityFilter)
  const controlsDisabled = isLoading || isError

  return (
    <div
      className={classNames(
        'seam-ecosystem',
        'seam-supported-devices',
        getEcosystemThemeClassName(theme),
        className
      )}
    >
      {(!hideTitle || !hideSearch || showFilters) && (
        <div className='seam-ecosystem-header'>
          {!hideTitle && <h2 className='seam-ecosystem-title'>{title}</h2>}
          <div className='seam-ecosystem-controls seam-supported-device-filters'>
            {!hideSearch && (
              <SearchField
                label={t.search}
                value={searchValue}
                onChange={setSearchValue}
                disabled={controlsDisabled}
              />
            )}
            {showFilters && showManufacturerFilter && (
              <FilterSelect
                label={t.manufacturer}
                allLabel={t.allManufacturers}
                options={manufacturerOptions}
                value={selectedManufacturer}
                onChange={setSelectedManufacturer}
                disabled={controlsDisabled}
              />
            )}
            {showFilters && showDeviceTypeFilter && (
              <FilterSelect
                label={t.deviceType}
                allLabel={t.allDeviceTypes}
                options={deviceTypeOptions}
                value={selectedDeviceType}
                onChange={setSelectedDeviceType}
                disabled={controlsDisabled}
              />
            )}
            {showFilters && showCapabilityFilter && (
              <CapabilityFilter
                capabilities={capabilityOptions.map((option) => option.value)}
                selected={selectedCapabilities}
                onChange={setSelectedCapabilities}
                disabled={controlsDisabled}
              />
            )}
          </div>
        </div>
      )}
      {!isLoading && !isError && availableDeviceModels.length > 0 && (
        <CapabilityLegend />
      )}
      <AccessoryCatalog slugs={accessorySlugs}>{content}</AccessoryCatalog>
    </div>
  )
}

function LoadingRows(): JSX.Element {
  return <StateMessage role='status'>Loading supported devices…</StateMessage>
}

const normalizeSlug = (slug: string | undefined): string | null => {
  const value = slug?.trim()
  return value == null || value.length === 0 ? null : value
}

const getScopedManufacturerName = (
  slug: string,
  manufacturer: Manufacturer | undefined,
  fallback: string | null | undefined
): string => {
  if (manufacturer != null) return getManufacturerName(manufacturer)
  return fallback ?? slug
}

const t = {
  title: 'Supported devices',
  manufacturerTitle: (name: string) => `Supported ${name} devices`,
  search: 'Search devices',
  manufacturer: 'Manufacturer',
  allManufacturers: 'All manufacturers',
  deviceType: 'Device type',
  allDeviceTypes: 'All device types',
  error: 'An error occurred while loading supported devices.',
  retry: 'Retry',
  noDevices: 'No supported devices found.',
  noMatches: 'No devices match your search or filters.',
  clearFilters: 'Clear filters',
}
