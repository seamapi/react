import type {
  SeamActionAttemptFailedError,
  SeamActionAttemptTimeoutError,
  SeamHttpApiError,
  SeamHttpEndpointQueryPaths,
  SeamHttpEndpoints,
  SeamHttpInvalidInputError,
} from '@seamapi/http/connect'
import type { ActionAttempt } from '@seamapi/types/connect'
import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseSeamQueryParameters<T extends SeamHttpEndpointQueryPaths> =
  Parameters<SeamHttpEndpoints[T]>[0]

export type UseSeamQueryResult<T extends SeamHttpEndpointQueryPaths> =
  UseQueryResult<QueryData<T>, QueryError<T>>

export function useSeamQuery<T extends SeamHttpEndpointQueryPaths>(
  endpointPath: T,
  parameters: UseSeamQueryParameters<T> = {},
  options: Parameters<SeamHttpEndpoints[T]>[1] &
    QueryOptions<QueryData<T>, SeamHttpApiError> = {}
): UseSeamQueryResult<T> & { queryKey: QueryKey } {
  const { endpointClient: client, queryKeyPrefixes } = useSeamClient()
  const queryKey = [
    ...queryKeyPrefixes,
    ...endpointPath.split('/').filter((v) => v !== ''),
    parameters ?? {},
  ]
  const result = useQuery({
    enabled: client != null,
    ...options,
    queryKey,
    queryFn: async () => {
      if (client == null) return null
      // Using @ts-expect-error over any is preferred, but not possible here because TypeScript will run out of memory.
      // Type assertion is needed here for performance reasons. The types are correct at runtime.
      const endpoint = client[endpointPath] as (...args: any) => Promise<any>
      return await endpoint(parameters, options)
    },
  })
  return { ...result, queryKey }
}

type QueryData<T extends SeamHttpEndpointQueryPaths> = Awaited<
  ReturnType<SeamHttpEndpoints[T]>
>

type QueryError<T extends SeamHttpEndpointQueryPaths> =
  | Error
  | SeamHttpApiError
  | SeamHttpInvalidInputError
  | (QueryData<T> extends ActionAttempt
      ?
          | SeamActionAttemptFailedError<QueryData<T>>
          | SeamActionAttemptTimeoutError<QueryData<T>>
      : never)

type QueryOptions<X, Y> = Omit<UseQueryOptions<X, Y>, 'queryKey' | 'queryFn'>
