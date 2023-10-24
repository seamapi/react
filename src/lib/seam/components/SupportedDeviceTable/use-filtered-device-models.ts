import {
  useDeviceModels,
  type UseDeviceModelsParams,
} from 'lib/seam/components/SupportedDeviceTable/use-device-models.js'
import { useManufacturers } from 'lib/seam/components/SupportedDeviceTable/use-manufacturers.js'

export interface DeviceModelFilters {
  supportedOnly: boolean
  manufacturer: string | null
}

export const useFilteredDeviceModels = ({
  filterValue,
  filters,
  manufacturers,
  excludedManufacturers,
}: {
  filterValue: string
  filters: DeviceModelFilters
  manufacturers: string[] | null
  excludedManufacturers: string[]
}): ReturnType<typeof useDeviceModels> => {
  const { manufacturers: manufacturersData } = useManufacturers()

  const params: UseDeviceModelsParams = {}

  if (filterValue.trim() !== '') {
    params.text_search = filterValue.trim()
  }

  if (filters.supportedOnly) {
    params.integration_status = 'stable'
  }

  if (filters.manufacturer !== null) {
    const manufacturer = manufacturersData?.find(
      (manufacturer) => manufacturer.display_name === filters.manufacturer
    )

    if (manufacturer != null) {
      params.manufacturer_id = manufacturer.manufacturer_id
    }
  }

  const query = useDeviceModels(params)

  // TODO: Use API to filter manufacturers.
  return {
    ...query,
    deviceModels: query.deviceModels
      ?.filter(({ manufacturer }) => {
        if (manufacturers === null) return true
        return manufacturers.includes(manufacturer.display_name)
      })
      .filter(({ manufacturer }) => {
        return !excludedManufacturers.includes(manufacturer.display_name)
      }),
  }
}
