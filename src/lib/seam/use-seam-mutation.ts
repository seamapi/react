import type {
  SeamHttpApiError,
  SeamHttpEndpointMutationPaths,
  SeamHttpEndpoints,
} from '@seamapi/http/connect'
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

type MutationOptions = Omit<UseMutationOptions, 'mutationFn'>

export function useSeamMutation<T extends SeamHttpEndpointMutationPaths>(
  endpointPath: T,
  options?: Parameters<SeamHttpEndpoints[T]>[1],
  _mutationOptions: MutationOptions = {}
): UseMutationResult<
  Awaited<ReturnType<SeamHttpEndpoints[T]>>,
  SeamHttpApiError,
  Parameters<SeamHttpEndpoints[T]>[1]
> {
  const { endpointClient: client } = useSeamClient()
  return useMutation({
    mutationFn: async (parameters) => {
      if (client === null) throw new NullSeamClientError()
      // Using @ts-expect-error over any is preferred, but not possible here because TypeScript will run out of memory.
      // Type assertion is needed here for performance reasons. The types are correct at runtime.
      const endpoint = client[endpointPath] as any
      return await endpoint(parameters, options)
    },
  })
}
