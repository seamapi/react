import type {
  AccessCodesListParams,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import type { AccessCode } from '@seamapi/types/connect'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseAccessCodesParams = AccessCodesListParams
export type UseAccessCodesData = AccessCode[]

export function useAccessCodes(
  params: UseAccessCodesParams
): UseSeamQueryResult<'accessCodes', UseAccessCodesData> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<UseAccessCodesData, SeamHttpApiError>({
    enabled: client != null,
    queryKey: ['access_codes', 'list', params],
    queryFn: async () => {
      if (client == null) return []
      const accessCodes = await client.accessCodes.list(params)
      for (const accessCode of accessCodes) {
        queryClient.setQueryData(
          [
            'access_codes',
            'get',
            { access_code_id: accessCode.access_code_id },
          ],
          accessCode
        )
      }
      return accessCodes
    },
  })

  return { ...rest, accessCodes: data }
}
