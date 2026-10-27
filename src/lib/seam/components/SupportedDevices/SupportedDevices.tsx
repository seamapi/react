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
  groupDeviceModelsByManufacturer,
  scopeDeviceModelsToProvider,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import { FilterSelect } from 'lib/seam/components/SupportedDevices/FilterSelect.js'
import { ManufacturerSection } from 'lib/seam/components/SupportedDevices/ManufacturerSection.js'
import { useEcosystemContext } from 'lib/seam/ecosystem/EcosystemProvider.js'
import type { Manufacturer } from 'lib/seam/ecosystem/types.js'
import { useEcosystemDeviceModelSummaries } from 'lib/seam/ecosystem/use-ecosystem-device-model-summaries.js'
import { useEcosystemManufacturers } from 'lib/seam/ecosystem/use-ecosystem-manufacturers.js'
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

export interface SupportedDevicesProps {
  /**
   * DeviceDB manufacturer slug, e.g., `schlage`.
   * Defaults to the manufacturer of a manufacturer embed key.
   */
  manufacturer?: string | undefined
  /** Ecosystem provider slug, e.g., `oracode`. Scopes models and capability badges. */
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
 * with device type and capability badges.
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

  const availableDeviceModels = useMemo(
    () =>
      scopeDeviceModelsToProvider(
        applyEmbedExclusions(deviceModels ?? [], embedResolution?.exclusions),
        fixedProvider
      ),
    [deviceModels, embedResolution, fixedProvider]
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
  const [selectedCapability, setSelectedCapability] = useState<string | null>(
    null
  )
  const search = useDeferredValue(searchValue)

  const filteredDeviceModels = useMemo(
    () =>
      filterDeviceModels(availableDeviceModels, {
        manufacturer: scopeManufacturer ?? selectedManufacturer,
        deviceType: fixedDeviceType ?? selectedDeviceType,
        capability: fixedCapability ?? selectedCapability,
        search,
      }),
    [
      availableDeviceModels,
      scopeManufacturer,
      selectedManufacturer,
      fixedDeviceType,
      selectedDeviceType,
      fixedCapability,
      selectedCapability,
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
    selectedCapability != null

  const resetFilters = (): void => {
    setSearchValue('')
    setSelectedManufacturer(null)
    setSelectedDeviceType(null)
    setSelectedCapability(null)
  }

  const isError = isResolutionError || isDeviceModelsError
  const isLoading = !isError && (!isResolved || deviceModels == null)

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
        isResolutionError ? resolutionError : deviceModelsError,
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
            group={group}
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
          <div className='seam-ecosystem-controls'>
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
              <FilterSelect
                label={t.capability}
                allLabel={t.allCapabilities}
                options={capabilityOptions}
                value={selectedCapability}
                onChange={setSelectedCapability}
                disabled={controlsDisabled}
              />
            )}
            {!hideSearch && (
              <SearchField
                label={t.search}
                value={searchValue}
                onChange={setSearchValue}
                disabled={controlsDisabled}
              />
            )}
          </div>
        </div>
      )}
      {content}
    </div>
  )
}

function LoadingRows(): JSX.Element {
  return (
    <div className='seam-supported-devices-sections' aria-busy='true'>
      <section className='seam-supported-devices-section'>
        <div className='seam-supported-devices-section-header'>
          <div className='seam-ecosystem-skeleton seam-supported-devices-logo' />
          <div className='seam-ecosystem-skeleton seam-ecosystem-skeleton-line-short' />
        </div>
        <ul className='seam-supported-devices-rows'>
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index} className='seam-supported-devices-row'>
              <div className='seam-ecosystem-skeleton seam-supported-devices-image' />
              <div className='seam-supported-devices-info'>
                <div className='seam-ecosystem-skeleton seam-ecosystem-skeleton-line' />
                <div className='seam-ecosystem-skeleton seam-ecosystem-skeleton-line-short' />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const normalizeSlug = (value: string | undefined): string | null => {
  const slug = value?.trim()
  if (slug == null || slug.length === 0) return null
  return slug
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
  capability: 'Feature',
  allCapabilities: 'All features',
  error: 'An error occurred while loading supported devices.',
  retry: 'Retry',
  noDevices: 'No supported devices found.',
  noMatches: 'No devices match your search or filters.',
  clearFilters: 'Clear filters',
}
