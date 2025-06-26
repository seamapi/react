import type {
  SeamHttpApiError,
  SeamHttpEndpointQueryPaths,
  SeamHttpEndpoints,
} from '@seamapi/http/connect'
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

type QueryOptions = Omit<UseQueryOptions, 'queryKey' | 'queryFn'>

export function useSeamQuery<T extends SeamHttpEndpointQueryPaths>(
  endpointPath: T,
  parameters?: Parameters<SeamHttpEndpoints[T]>[0],
  options?: Parameters<SeamHttpEndpoints[T]>[1],
  _queryOptions: QueryOptions = {}
): UseQueryResult<Awaited<ReturnType<SeamHttpEndpoints[T]>>, SeamHttpApiError> {
  const { endpointClient: client } = useSeamClient()
  return useQuery({
    enabled: client != null,
    queryKey: [endpointPath, parameters],
    queryFn: async () => {
      if (client == null) return null
      // Using @ts-expect-error over any is preferred, but not possible here because TypeScript will run out of memory.
      // Type assertion is needed here for performance reasons. The types are correct at runtime.
      const endpoint = client[endpointPath] as any
      return await endpoint(parameters, options)
    },
  })
}
