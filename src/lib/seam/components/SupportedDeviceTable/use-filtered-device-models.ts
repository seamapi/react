import {
  useDeviceModels,
  type UseDeviceModelsParams,
} from 'lib/seam/device-models/use-device-models.js'

export interface DeviceModelFilters {
  supportedOnly: boolean
  category: string | null
  brand: string | null
}

export const useFilteredDeviceModels = (
  filterValue: string,
  filters: DeviceModelFilters
): ReturnType<typeof useDeviceModels> => {
  const params: UseDeviceModelsParams = {}

  if (filterValue.trim() !== '') {
    params.text_search = filterValue.trim()
  }

  if (filters.supportedOnly) {
    params.support_level = 'live'
  }

  if (filters.category !== null) {
    params.main_category = filters.category
  }

  if (filters.brand !== null) {
    params.brand = filters.brand
  }

  return useDeviceModels(params)
}
