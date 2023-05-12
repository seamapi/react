import { useQuery } from '@tanstack/react-query'
import type { LockDevice, LockGetResponse, SeamError } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseLockParmas = string
export type UseLockData = LockDevice | null

export function useLock(
  deviceId: UseLockParmas
): UseSeamQueryResult<'device', UseLockData> {
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<LockGetResponse['lock'] | null, SeamError>(
    {
      enabled: client != null,
      queryKey: ['locks', 'get', deviceId],
      queryFn: async () => {
        if (client == null) return null
        return await client?.locks.get(deviceId)
      },
    }
  )

  return { ...rest, device: data }
}
