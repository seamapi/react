import type { SeamHttpApiError } from '@seamapi/http/connect'
import type { ClientSession } from '@seamapi/types/connect'
import { useQuery } from '@tanstack/react-query'

import { useSeamClient } from '@seamapi/react-query'
import type { UseSeamQueryResultLegacy } from 'lib/seam/use-seam-query-result.js'

export type UseClientSessionParams = never

export type UseClientSessionData = ClientSession | null

export function useClientSession(): UseSeamQueryResultLegacy<
  'clientSession',
  UseClientSessionData
> {
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<UseClientSessionData, SeamHttpApiError>({
    enabled: client != null,
    queryKey: ['client_session', 'get'],
    queryFn: async () => {
      if (client == null) return null
      return await client.clientSessions.get()
    },
  })

  return { ...rest, clientSession: data }
}
