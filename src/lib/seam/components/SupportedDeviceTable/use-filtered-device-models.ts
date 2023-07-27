import {
  useDeviceModels,
  type UseDeviceModelsParams,
} from 'lib/seam/device-models/use-device-models.js'

export interface DeviceModelFilters {
  supportedOnly: boolean
  brand: string | null
}

export const useFilteredDeviceModels = ({
  filterValue,
  filters,
  brands,
}: {
  filterValue: string
  filters: DeviceModelFilters
  brands: string[]
}): ReturnType<typeof useDeviceModels> => {
  const params: UseDeviceModelsParams = {}

  if (filterValue.trim() !== '') {
    params.text_search = filterValue.trim()
  }

  if (filters.supportedOnly) {
    params.support_level = 'live'
  }

  if (filters.brand !== null) {
    params.brand = filters.brand
  }

  const query = useDeviceModels(params)

  if (brands.length === 0) {
    return query
  }

  // If the user only wants models for a collection of brands, such as ["yale", "august"], then
  // we'll filter everything else out here.
  const onlySpecificBrands = query.deviceModels?.filter((deviceModel) =>
    brands.includes(deviceModel.brand)
  )

  return { ...query, deviceModels: onlySpecificBrands }
}
