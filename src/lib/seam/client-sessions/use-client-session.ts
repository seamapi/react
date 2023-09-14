import { useQuery } from '@tanstack/react-query'
import type {
  ClientSession,
  ClientSessionsGetResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseClientSessionParams = never
export type UseClientSessionData = ClientSession | null

export function useClientSession(): UseSeamQueryResult<
  'clientSession',
  UseClientSessionData
> {
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<
    ClientSessionsGetResponse['client_session'] | null,
    SeamError
  >({
    enabled: client != null,
    queryKey: ['client_session', 'get'],
    queryFn: async () => {
      if (client == null) return null
      return await client.clientSessions.get({})
    },
  })

  return { ...rest, clientSession: data }
}
