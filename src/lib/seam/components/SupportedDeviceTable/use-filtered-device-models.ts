import {
  useDeviceModels,
  type UseDeviceModelsParams,
} from 'lib/seam/components/SupportedDeviceTable/use-device-models.js'

export interface DeviceModelFilters {
  supportedOnly: boolean
  manufacturer: string | null
}

export const useFilteredDeviceModels = ({
  manufacturerId,
  filterValue,
  filters,
}: {
  manufacturerId: string
  filterValue: string
  filters: DeviceModelFilters
}): ReturnType<typeof useDeviceModels> => {
  const params: UseDeviceModelsParams = {
    manufacturer_id: manufacturerId,
  }

  if (filterValue.trim() !== '') {
    params.text_search = filterValue.trim()
  }

  if (filters.supportedOnly) {
    params.integration_status = 'stable'
  }

  return useDeviceModels(params)
}
