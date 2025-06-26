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

export function useSeamMutation<T extends SeamHttpEndpointMutationPaths>(
  endpointPath: T,
  options: Parameters<SeamHttpEndpoints[T]>[1] &
    MutationOptions<
      MutationData<T>,
      SeamHttpApiError,
      MutationParameters<T>
    > = {}
): UseMutationResult<MutationData<T>, SeamHttpApiError, MutationParameters<T>> {
  const { endpointClient: client } = useSeamClient()
  return useMutation({
    ...options,
    mutationFn: async (parameters) => {
      if (client === null) throw new NullSeamClientError()
      // Using @ts-expect-error over any is preferred, but not possible here because TypeScript will run out of memory.
      // Type assertion is needed here for performance reasons. The types are correct at runtime.
      const endpoint = client[endpointPath] as (...args: any) => Promise<any>
      return await endpoint(parameters, options)
    },
  })
}

type MutationData<T extends SeamHttpEndpointMutationPaths> = Awaited<
  ReturnType<SeamHttpEndpoints[T]>
>

type MutationParameters<T extends SeamHttpEndpointMutationPaths> = Parameters<
  SeamHttpEndpoints[T]
>[1]

type MutationOptions<X, Y, Z> = Omit<UseMutationOptions<X, Y, Z>, 'mutationFn'>
