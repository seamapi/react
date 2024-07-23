import type {
  AccessCodesGetParams,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import type { AccessCode } from '@seamapi/types/connect'
import { useQuery } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseAccessCodeParams = AccessCodesGetParams

export type UseAccessCodeData = AccessCode | null

export function useAccessCode(
  params: UseAccessCodeParams
): UseSeamQueryResult<'accessCode', UseAccessCodeData> {
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<UseAccessCodeData, SeamHttpApiError>({
    enabled: client != null,
    queryKey: ['access_codes', 'get', params],
    queryFn: async () => {
      if (client == null) return null
      return await client.accessCodes.get(params)
    },
  })
  return { ...rest, accessCode: data }
}
