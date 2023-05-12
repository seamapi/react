import { useQuery } from '@tanstack/react-query'
import type { AccessCode, AccessCodeGetRequest } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseAccessCodeParams = AccessCodeGetRequest | string
export type UseAccessCodeData = AccessCode

export function useAccessCode(params: UseAccessCodeParams) {
  const { client } = useSeamClient()

  const normalizedParams =
    typeof params === 'string' ? { access_code_id: params } : params

  return useQuery({
    enabled: client != null,
    queryKey: ['access_code', 'get', normalizedParams],
    queryFn: async () => {
      if (client == null) return null

      return await client?.accessCodes.get(normalizedParams)
    },
  })
}
