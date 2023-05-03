import { useQuery } from '@tanstack/react-query'
import type { Device, SeamError } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/types/use-seam-query-result.js'

export function useAccessCodes(
  params:
    | {
        device_id: string
      }
    | string
): UseSeamQueryResult<'device', Device<any>> {
  const objParams = typeof params === 'string' ? { device_id: params } : params
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<any, SeamError>({
    enabled: client != null,
    queryKey: ['device', 'get', params],
    queryFn: async () => {
      if (client == null) return []
      return await client?.devices.get(objParams)
    },
  })

  return { ...rest, device: data }
}
