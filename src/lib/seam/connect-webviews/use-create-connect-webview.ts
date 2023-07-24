import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import type {
  ConnectWebview,
  ConnectWebviewCreateRequest,
  ConnectWebviewCreateResponse,
  SeamError,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export interface UseCreateConnectWebviewParams {
  willNavigateToWebview?: boolean
}

export type UseCreateConnectWebviewData = ConnectWebview
export type UseCreateConnectWebviewMutationParams = ConnectWebviewCreateRequest

export function useCreateConnectWebview({
  willNavigateToWebview = false,
}: UseCreateConnectWebviewParams = {}): UseMutationResult<
  UseCreateConnectWebviewData,
  SeamError,
  UseCreateConnectWebviewMutationParams
> {
  const { client } = useSeamClient()

  return useMutation<
    ConnectWebviewCreateResponse['connect_webview'],
    SeamError,
    ConnectWebviewCreateRequest
  >({
    mutationFn: async (
      mutationParams: UseCreateConnectWebviewMutationParams
    ) => {
      if (client === null) throw new NullSeamClientError()
      return await client.connectWebviews.create(mutationParams)
    },
    onSuccess: ({ url }) => {
      if (willNavigateToWebview && url != null) {
        globalThis.location.href = url
      }
    },
  })
}
