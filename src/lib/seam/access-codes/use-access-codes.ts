import { useQuery } from '@tanstack/react-query'
import type { AccessCode, SeamError } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export function useAccessCodes(params: {
  device_id: string
}): UseSeamQueryResult<'accessCodes', AccessCode[]> {
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<any, SeamError>({
    enabled: client != null,
    queryKey: ['access_codes', 'list', params],
    queryFn: async () => {
      if (client == null) return []
      return await client?.accessCodes.list(params)
    },
  })

  return { ...rest, accessCodes: data }
}
