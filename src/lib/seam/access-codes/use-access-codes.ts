import { useQuery } from '@tanstack/react-query'
import type {
  AccessCode,
  AccessCodesListRequest,
  AccessCodesListResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

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
    enabled: client != null,
    queryKey: ['access_codes', 'list', normalizedParams],
    queryFn: async () => {
      if (client == null) return []
      return await client?.accessCodes.list(normalizedParams)
    },
  })

  return { ...rest, accessCodes: data }
}
