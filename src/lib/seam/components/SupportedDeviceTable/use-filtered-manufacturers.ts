import { useManufacturers } from 'lib/seam/components/SupportedDeviceTable/use-manufacturers.js'

export const useFilteredManufacturers = ({
  manufacturers,
  excludedManufacturers,
}: {
  manufacturers: string[] | null
  excludedManufacturers: string[]
}): ReturnType<typeof useManufacturers> => {
  // TODO: Use API to filter manufacturers.
  const { manufacturers: manufacturersData, ...query } = useManufacturers()

  if (manufacturersData == null) {
    return { manufacturers: manufacturersData, ...query }
  }

  const availableManufacturers = manufacturersData
    .filter((manufacturer) => {
      if (manufacturers === null) return true
      return manufacturers.includes(manufacturer.display_name)
    })
    .filter((manufacturer) => {
      return !excludedManufacturers.includes(manufacturer.display_name)
    })

  return { manufacturers: availableManufacturers, ...query }
}
