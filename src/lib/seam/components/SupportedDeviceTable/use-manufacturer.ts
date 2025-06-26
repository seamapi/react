import type { SeamHttpApiError } from '@seamapi/http/connect'
import type {
  Manufacturer,
  RouteRequestParams,
  RouteResponse,
} from '@seamapi/types/devicedb'
import { useQuery } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResultLegacy } from 'lib/seam/use-seam-query-result.js'

export type UseManufacturerParams = ManufacturersGetParams

export type UseManufacturerData = Manufacturer | null

export function useManufacturer(
  params: UseManufacturerParams
): UseSeamQueryResultLegacy<'manufacturer', UseManufacturerData> {
  const { client: seam } = useSeamClient()
  const { data, ...rest } = useQuery<UseManufacturerData, SeamHttpApiError>({
    enabled: seam != null,
    queryKey: ['internal', 'manufacturers', 'get', params],
    queryFn: async () => {
      if (seam == null) return null
      const {
        data: { manufacturer },
      } = await seam.client.get<ManufacturersGetResponse>(
        '/internal/devicedb/v1/manufacturers/get',
        { params }
      )
      return manufacturer
    },
  })

  return { ...rest, manufacturer: data }
}

type ManufacturersGetParams = RouteRequestParams<'/v1/manufacturers/get'>

type ManufacturersGetResponse = RouteResponse<'/v1/manufacturers/get'>
