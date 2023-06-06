import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import type {
  ConnectWebview,
  ConnectWebviewCreateRequest,
  ConnectWebviewCreateResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export interface UseCreateConnectWebviewParams {
  willNavigateToWebview?: boolean
}

export type UseCreateConnectWebviewMutationParams = ConnectWebviewCreateRequest

export function useCreateConnectWebview({
  willNavigateToWebview = false,
}: UseCreateConnectWebviewParams = {}): UseMutationResult<
  ConnectWebview,
  SeamError,
  ConnectWebviewCreateRequest
> {
  const { client } = useSeamClient()

  return useMutation<
    ConnectWebviewCreateResponse['connect_webview'],
    SeamError,
    UseCreateConnectWebviewMutationParams
  >({
    mutationFn: async (
      mutationParams: UseCreateConnectWebviewMutationParams
    ) => {
      if (client == null) {
        throw new Error('Missing seam client')
      }

      return await client.connectWebviews.create(mutationParams)
    },
    onSuccess: ({ url }) => {
      if (willNavigateToWebview && url != null) {
        globalThis.location.href = url
      }
    },
  })
}
