import type { ManufacturerIntegrationSupportLevel } from '@seamapi/types/devicedb'

import {
  useDeviceModels,
  type UseDeviceModelsParams,
} from 'lib/seam/components/SupportedDeviceTable/use-device-models.js'

import { useFilteredManufacturers } from './use-filtered-manufacturers.js'

export interface DeviceModelFilters {
  supportedOnly: boolean
  manufacturer: string | null
}

export const supportedIntegrationSupportLevels: ManufacturerIntegrationSupportLevel[] =
  ['stable', 'beta']

export const useFilteredDeviceModels = ({
  filterValue,
  filters,
  includeIf,
  excludeIf,
  ...manufacturersParams
}: {
  filterValue: string
  filters: DeviceModelFilters
  manufacturers: string[] | null
  excludedManufacturers: string[]
  includeIf: string[] | null
  excludeIf: string[]
}): ReturnType<typeof useDeviceModels> => {
  const { manufacturers } = useFilteredManufacturers({
    ...manufacturersParams,
    integrationSupportLevels: filters.supportedOnly
      ? supportedIntegrationSupportLevels
      : null,
  })

  const params: UseDeviceModelsParams = {}

  if (excludeIf.length > 0) {
    params.exclude_if = excludeIf
  }

  // UPSTREAM: API does not parse zero-length arrays correctly.
  if (includeIf != null && includeIf.length > 0) {
    params.include_if = includeIf
  }

  if (filterValue.trim() !== '') {
    params.text_search = filterValue.trim()
  }

  if (filters.supportedOnly) {
    params.integration_support_levels = supportedIntegrationSupportLevels
  }

  if (filters.manufacturer !== null) {
    const manufacturer = manufacturers?.find(
      (manufacturer) => manufacturer.display_name === filters.manufacturer
    )

    if (manufacturer != null) {
      params.manufacturer_id = manufacturer.manufacturer_id
    }
  }

  if (filters.manufacturer == null && manufacturers != null) {
    params.manufacturer_ids = manufacturers.map((m) => m.manufacturer_id)
  }

  const { deviceModels, ...rest } = useDeviceModels(params)

  return {
    ...rest,
    deviceModels:
      // UPSTREAM: API does not parse zero-length arrays correctly.
      includeIf?.length === 0
        ? []
        : deviceModels?.filter((deviceModel) =>
            manufacturers?.some(
              (manufacturer) =>
                deviceModel.manufacturer.manufacturer_id ===
                manufacturer.manufacturer_id
            )
          ),
  }
}
