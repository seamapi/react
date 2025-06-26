import type { SeamHttpApiError, SeamHttpEndpoints } from '@seamapi/http/connect'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

type Endpoints = Pick<
  SeamHttpEndpoints,
  Extract<keyof SeamHttpEndpoints, `/${string}`>
>

export function useSeamQuery<T extends keyof Endpoints>(
  endpointPath: T,
  params?: Parameters<Endpoints[T]>[0],
  options?: Parameters<Endpoints[T]>[1]
): UseQueryResult<Awaited<ReturnType<Endpoints[T]>>, SeamHttpApiError> {
  const { endpointClient: client } = useSeamClient()
  return useQuery({
    enabled: client != null,
    queryKey: [endpointPath, params],
    queryFn: async () => {
      if (client == null) return null
      const endpoint = client[endpointPath] as Endpoints[T]
      // @ts-expect-error: The types are correct at runtime, but TypeScript can't infer the specific endpoint types
      return await endpoint(params, options)
    },
  })
}
