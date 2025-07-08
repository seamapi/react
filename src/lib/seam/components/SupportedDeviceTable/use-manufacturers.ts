import type { SeamHttpApiError } from '@seamapi/http/connect'
import { useSeamClient } from '@seamapi/react-query'
import type {
  Manufacturer,
  RouteRequestParams,
  RouteResponse,
} from '@seamapi/types/devicedb'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import type { UseSeamQueryResultLegacy } from 'lib/seam/use-seam-query-result.js'

export type UseManufacturersParams = ManufacturersListParams

export type UseManufacturersData = Manufacturer[]

export function useManufacturers(
  params?: UseManufacturersParams
): UseSeamQueryResultLegacy<'manufacturers', UseManufacturersData> {
  const { client: seam } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<UseManufacturersData, SeamHttpApiError>({
    enabled: seam != null,
    queryKey: ['internal', 'manufacturers', 'list', params],
    queryFn: async () => {
      if (seam == null) return []
      const {
        data: { manufacturers },
      } = await seam.client.get<ManufacturersListResponse>(
        '/internal/devicedb/v1/manufacturers/list',
        { params }
      )
      for (const manufacturer of manufacturers) {
        queryClient.setQueryData(
          [
            'internal',
            'manufacturers',
            'get',
            { manufacturer_id: manufacturer.manufacturer_id },
          ],
          manufacturer
        )
      }
      return manufacturers
    },
  })

  return { ...rest, manufacturers: data }
}

type ManufacturersListParams = RouteRequestParams<'/v1/manufacturers/list'>

type ManufacturersListResponse = RouteResponse<'/v1/manufacturers/list'>
