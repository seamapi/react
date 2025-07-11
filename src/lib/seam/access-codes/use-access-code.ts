import type {
  AccessCodesGetParams,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import { useSeamClient } from '@seamapi/react-query'
import type { AccessCode } from '@seamapi/types/connect'
import { useQuery } from '@tanstack/react-query'

import type { UseSeamQueryResultLegacy } from 'lib/seam/use-seam-query-result.js'

export type UseAccessCodeParams = AccessCodesGetParams

export type UseAccessCodeData = AccessCode | null

export function useAccessCode(
  params: UseAccessCodeParams
): UseSeamQueryResultLegacy<'accessCode', UseAccessCodeData> {
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
