import type {
  SeamHttpApiError,
  SeamHttpEndpointsWithoutWorkspace,
  SeamHttpEndpointWithoutWorkspaceMutationPaths,
} from '@seamapi/http/connect'
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseSeamMutationWithoutWorkspaceVariables<
  T extends SeamHttpEndpointWithoutWorkspaceMutationPaths,
> = Parameters<SeamHttpEndpointsWithoutWorkspace[T]>[0]

export type UseSeamMutationWithoutWorkspaceResult<
  T extends SeamHttpEndpointWithoutWorkspaceMutationPaths,
> = UseMutationResult<
  MutationData<T>,
  SeamHttpApiError,
  UseSeamMutationWithoutWorkspaceVariables<T>
>

export function UseSeamMutationWithoutWorkspace<
  T extends SeamHttpEndpointWithoutWorkspaceMutationPaths,
>(
  endpointPath: T,
  options: Parameters<SeamHttpEndpointsWithoutWorkspace[T]>[1] &
    MutationOptions<
      MutationData<T>,
      SeamHttpApiError,
      UseSeamMutationWithoutWorkspaceVariables<T>
    > = {}
): UseSeamMutationWithoutWorkspaceResult<T> {
  const { endpointClient: client } = useSeamClient()
  return useMutation({
    ...options,
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      // Using @ts-expect-error over any is preferred, but not possible here because TypeScript will run out of memory.
      // Type assertion is needed here for performance reasons. The types are correct at runtime.
      const endpoint = client[endpointPath] as (...args: any) => Promise<any>
      return await endpoint(variables, options)
    },
  })
}

type MutationData<T extends SeamHttpEndpointWithoutWorkspaceMutationPaths> =
  Awaited<ReturnType<SeamHttpEndpointsWithoutWorkspace[T]>>

type MutationOptions<X, Y, Z> = Omit<UseMutationOptions<X, Y, Z>, 'mutationFn'>
