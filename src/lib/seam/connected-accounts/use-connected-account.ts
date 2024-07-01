import type {
  ConnectedAccountsGetParams,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import type { ConnectedAccount } from '@seamapi/types/connect'
import { useQuery } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseConnectedAccountParams = ConnectedAccountsGetParams

export type UseConnectedAccountData = ConnectedAccount | null

export function useConnectedAccount(
  params: UseConnectedAccountParams
): UseSeamQueryResult<'connectedAccount', UseConnectedAccountData> {
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<UseConnectedAccountData, SeamHttpApiError>(
    {
      enabled: client != null,
      queryKey: ['connected_accounts', 'get', params],
      queryFn: async () => {
        if (client == null) return null
        return await client.connectedAccounts.get(params)
      },
    }
  )

  return { ...rest, connectedAccount: data }
}
