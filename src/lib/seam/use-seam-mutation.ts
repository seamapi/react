import type {
  SeamActionAttemptFailedError,
  SeamActionAttemptTimeoutError,
  SeamHttpApiError,
  SeamHttpEndpointMutationPaths,
  SeamHttpEndpoints,
  SeamHttpInvalidInputError,
} from '@seamapi/http/connect'
import type { ActionAttempt } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseSeamMutationVariables<T extends SeamHttpEndpointMutationPaths> =
  Parameters<SeamHttpEndpoints[T]>[0]

export type UseSeamMutationResult<T extends SeamHttpEndpointMutationPaths> =
  UseMutationResult<
    MutationData<T>,
    MutationError<T>,
    UseSeamMutationVariables<T>
  >

export function useSeamMutation<T extends SeamHttpEndpointMutationPaths>(
  endpointPath: T,
  options: Parameters<SeamHttpEndpoints[T]>[1] &
    MutationOptions<
      MutationData<T>,
      MutationError<T>,
      UseSeamMutationVariables<T>
    > = {}
): UseSeamMutationResult<T> {
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

type MutationData<T extends SeamHttpEndpointMutationPaths> = Awaited<
  ReturnType<SeamHttpEndpoints[T]>
>

type MutationError<T extends SeamHttpEndpointMutationPaths> =
  | Error
  | SeamHttpApiError
  | SeamHttpInvalidInputError
  | (MutationData<T> extends ActionAttempt
      ?
          | SeamActionAttemptFailedError<MutationData<T>>
          | SeamActionAttemptTimeoutError<MutationData<T>>
      : never)

type MutationOptions<X, Y, Z> = Omit<UseMutationOptions<X, Y, Z>, 'mutationFn'>
