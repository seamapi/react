import type {
  ConnectWebviewsCreateBody,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import type { ConnectWebview } from '@seamapi/types/connect'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

import { useClientSession } from 'lib/seam/client-sessions/use-client-session.js'
import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export interface UseCreateConnectWebviewParams {
  willNavigateToWebview?: boolean
}

export type UseCreateConnectWebviewData = ConnectWebview

export type UseCreateConnectWebviewMutationVariables = ConnectWebviewsCreateBody

export function useCreateConnectWebview({
  willNavigateToWebview = false,
}: UseCreateConnectWebviewParams = {}): UseMutationResult<
  UseCreateConnectWebviewData,
  SeamHttpApiError,
  UseCreateConnectWebviewMutationVariables
> {
  const { client } = useSeamClient()
  const { clientSession } = useClientSession()

  return useMutation<
    UseCreateConnectWebviewData,
    SeamHttpApiError,
    UseCreateConnectWebviewMutationVariables
  >({
    mutationFn: async (
      mutationParams: UseCreateConnectWebviewMutationVariables
    ) => {
      if (client === null) throw new NullSeamClientError()
      return await client.connectWebviews.create({
        custom_metadata: {
          client_session_id: clientSession?.client_session_id ?? null,
          user_identifier_key: clientSession?.user_identifier_key ?? null,
          ...mutationParams.custom_metadata,
        },
        ...mutationParams,
      })
    },
    onSuccess: ({ url }) => {
      if (willNavigateToWebview && url != null) {
        globalThis.location.href = url
      }
    },
  })
}
