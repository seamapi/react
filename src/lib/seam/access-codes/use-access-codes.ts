import { useQuery } from '@tanstack/react-query'
import type {
  AccessCode,
  AccessCodesListRequest,
  AccessCodesListResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'
import { byCreatedAt } from 'lib/sort-by.js'

export type UseAccessCodesParams = AccessCodesListRequest | string
export type UseAccessCodesData = AccessCode[]

export function useAccessCodes(
  params: UseAccessCodesParams
): UseSeamQueryResult<'accessCodes', UseAccessCodesData> {
  const normalizedParams =
    typeof params === 'string' ? { device_id: params } : params

  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<
    AccessCodesListResponse['access_codes'],
    SeamError
  >({
    enabled: client != null && normalizedParams.device_id != null,
    queryKey: ['access_codes', 'list', normalizedParams],
    queryFn: async () => {
      if (client == null) return []
      const accessCodes = await client?.accessCodes.list(normalizedParams)
      return accessCodes.sort(byCreatedAt)
    },
  })

  return { ...rest, accessCodes: data }
}
