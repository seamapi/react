import type {
  SeamHttpApiError,
  SeamHttpEndpointsWithoutWorkspace,
  SeamHttpEndpointWithoutWorkspaceQueryPaths,
  SeamHttpInvalidInputError,
} from '@seamapi/http/connect'
import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseSeamQueryWithoutWorkspaceParameters<
  T extends SeamHttpEndpointWithoutWorkspaceQueryPaths,
> = Parameters<SeamHttpEndpointsWithoutWorkspace[T]>[0]

export type UseSeamQueryWithoutWorkspaceResult<
  T extends SeamHttpEndpointWithoutWorkspaceQueryPaths,
> = UseQueryResult<QueryData<T>, QueryError>

export function useSeamQueryWithoutWorkspace<
  T extends SeamHttpEndpointWithoutWorkspaceQueryPaths,
>(
  endpointPath: T,
  parameters: UseSeamQueryWithoutWorkspaceParameters<T> = {},
  options: Parameters<SeamHttpEndpointsWithoutWorkspace[T]>[1] &
    QueryOptions<QueryData<T>, QueryError> = {}
): UseSeamQueryWithoutWorkspaceResult<T> & { queryKey: QueryKey } {
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

type QueryData<T extends SeamHttpEndpointWithoutWorkspaceQueryPaths> = Awaited<
  ReturnType<SeamHttpEndpointsWithoutWorkspace[T]>
>

type QueryError = Error | SeamHttpApiError | SeamHttpInvalidInputError

type QueryOptions<X, Y> = Omit<UseQueryOptions<X, Y>, 'queryKey' | 'queryFn'>
