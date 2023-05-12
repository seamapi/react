import { useQuery } from '@tanstack/react-query'
import type { AccessCode, AccessCodesListResponse, SeamError } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export function useAccessCodes(
  params: { device_id: string } | string
): UseSeamQueryResult<'accessCodes', AccessCode[]> {
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
      const accessCodes = await client?.accessCodes.list(normalizedParams)
      return accessCodes.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    },
  })

  return { ...rest, accessCodes: data }
}
