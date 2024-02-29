import type { ManufacturerIntegrationSupportLevel } from '@seamapi/types/devicedb'

import { useManufacturers } from 'lib/seam/components/SupportedDeviceTable/use-manufacturers.js'

interface Params {
  manufacturers: string[] | null
  excludedManufacturers: string[]
  integrationSupportLevels: ManufacturerIntegrationSupportLevel[] | null
}

export const useFilteredManufacturers = ({
  integrationSupportLevels,
  ...params
}: Params): ReturnType<typeof useManufacturers> => {
  const { manufacturers, ...rest } = useManufacturers({
    integration_support_levels: integrationSupportLevels ?? undefined,
    liqe_query: createLiqeQuery(params),
  })

  return {
    ...rest,
    manufacturers: manufacturers?.filter(
      (manufacturer) => manufacturer.device_model_count > 0
    ),
  }
}

export const createLiqeQuery = ({
  manufacturers,
  excludedManufacturers,
}: Pick<Params, 'manufacturers' | 'excludedManufacturers'>):
  | string
  | undefined => {
  if (
    (manufacturers?.some(isInvalidInput) ?? false) ||
    excludedManufacturers.some(isInvalidInput)
  ) {
    return undefined
  }

  const excludedManufacturersClause = `NOT (${excludedManufacturers
    .map(manufacturerToMatcher)
    .join(' OR ')})`

  if (manufacturers == null) {
    if (excludedManufacturers.length === 0) return undefined
    return excludedManufacturersClause
  }

  if (manufacturers.length === 0) {
    return 'manufacturer_id:none'
  }

  const includedManufacturersClause = `(${manufacturers
    .map(manufacturerToMatcher)
    .join(' OR ')})`

  if (excludedManufacturers.length === 0) return includedManufacturersClause

  return `${includedManufacturersClause} AND ${excludedManufacturersClause}`
}

const manufacturerToMatcher = (value: string): string => {
  const [manufacturer, uuid] = value.split('=')
  if (uuid != null) return `manufacturer_id:"${uuid}"`
  return `display_name:"${manufacturer}"`
}

const isInvalidInput = (value: string): boolean => value.includes('"')
