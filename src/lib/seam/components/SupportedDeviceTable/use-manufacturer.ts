import type {
  Manufacturer,
  RouteRequestParams,
  RouteResponse,
} from '@seamapi/types/devicedb'
import { useQuery } from '@tanstack/react-query'
import type { SeamError } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseManufacturerParams = ManufacturersGetParams | string
export type UseManufacturerData = Manufacturer | null

export function useManufacturer(
  params?: UseManufacturerParams
): UseSeamQueryResult<'manufacturer', UseManufacturerData> {
  const normalizedParams =
    typeof params === 'string' ? { manufacturer_id: params } : params

  const { client: seam } = useSeamClient()
  const { data, ...rest } = useQuery<
    ManufacturersGetResponse['manufacturer'] | null,
    SeamError
  >({
    enabled: seam != null,
    queryKey: ['internal', 'manufacturers', 'get', normalizedParams],
    queryFn: async () => {
      if (seam == null) return null
      const {
        data: { manufacturer },
      } = await seam.client.get<ManufacturersGetResponse>(
        '/internal/devicedb/v1/manufacturers/get',
        { params: normalizedParams }
      )
      return manufacturer
    },
  })

  return { ...rest, manufacturer: data }
}

type ManufacturersGetParams = RouteRequestParams<'/v1/manufacturers/get'>

type ManufacturersGetResponse = RouteResponse<'/v1/manufacturers/get'>
