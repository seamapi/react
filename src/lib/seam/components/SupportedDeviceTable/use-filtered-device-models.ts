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
  omitBrands,
}: {
  filterValue: string
  filters: DeviceModelFilters
  brands: string[] | null
  omitBrands: string[]
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

  if (brands === null) {
    return query
  }

  // UPSTREAM: The API does not have a brands or omitBrands query parameter,
  // so selected brands are filtered here.
  return {
    ...query,
    deviceModels: query.deviceModels?.filter(({ brand}) =>
      brands.includes(brand) && !omitBrands.includes(brand)
    ),
  }
}
