import { useQuery } from '@tanstack/react-query'
import type {
  AccessCode,
  AccessCodeGetRequest,
  AccessCodeGetResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseAccessCodeParams = AccessCodeGetRequest | string
export type UseAccessCodeData = AccessCode | null

export function useAccessCode(
  params: UseAccessCodeParams
): UseSeamQueryResult<'accessCode', UseAccessCodeData> {
  const normalizedParams =
    typeof params === 'string' ? { access_code_id: params } : params

  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<
    AccessCodeGetResponse['access_code'] | null,
    SeamError
  >({
    enabled: client != null,
    queryKey: ['access_codes', 'get', normalizedParams],
    queryFn: async () => {
      if (client == null) return null
      return await client.accessCodes.get(normalizedParams)
    },
  })
  return { ...rest, accessCode: data }
}
