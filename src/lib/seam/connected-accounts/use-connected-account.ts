import { useQuery } from '@tanstack/react-query'
import type {
  ConnectedAccount,
  ConnectedAccountsGetRequest,
  ConnectedAccountsGetResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseConnectedAccountData = ConnectedAccount | null

export function useConnectedAccount(
  params: ConnectedAccountsGetRequest
): UseSeamQueryResult<'connectedAccount', UseConnectedAccountData> {
  const normalizedParams =
    typeof params === 'string' ? { connected_account_id: params } : params

  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<
    ConnectedAccountsGetResponse['connected_account'] | null,
    SeamError
  >({
    enabled: client != null,
    queryKey: ['connected_accounts', 'get', normalizedParams],
    queryFn: async () => {
      if (client == null) return null
      return await client.connectedAccounts.get(normalizedParams)
    },
  })

  return { ...rest, connectedAccount: data }
}
