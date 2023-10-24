import {
  useDeviceModels,
  type UseDeviceModelsParams,
} from 'lib/seam/components/SupportedDeviceTable/use-device-models.js'
import { useManufacturers } from 'lib/seam/components/SupportedDeviceTable/use-manufacturers.js'

export interface DeviceModelFilters {
  supportedOnly: boolean
  brand: string | null
}

export const useFilteredDeviceModels = ({
  filterValue,
  filters,
  brands,
  excludedBrands,
}: {
  filterValue: string
  filters: DeviceModelFilters
  brands: string[] | null
  excludedBrands: string[]
}): ReturnType<typeof useDeviceModels> => {
  const { manufacturers } = useManufacturers()

  const params: UseDeviceModelsParams = {}

  if (filterValue.trim() !== '') {
    params.text_search = filterValue.trim()
  }

  if (filters.supportedOnly) {
    params.integration_status = 'stable'
  }

  if (filters.brand !== null) {
    const manufacturer = manufacturers?.find(
      (manufacturer) => manufacturer.display_name === filters.brand
    )

    if (manufacturer != null) {
      params.manufacturer_id = manufacturer.manufacturer_id
    }
  }

  const query = useDeviceModels(params)

  // UPSTREAM: The API does not have a brands or excludedBrands query parameter,
  // so selected brands are filtered here.
  return {
    ...query,
    deviceModels: query.deviceModels
      ?.filter(({ manufacturer }) => {
        if (brands === null) return true
        return brands.includes(manufacturer.display_name)
      })
      .filter(({ manufacturer }) => {
        return !excludedBrands.includes(manufacturer.display_name)
      }),
  }
}
