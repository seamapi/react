import type {
  SeamActionAttemptFailedError,
  SeamActionAttemptTimeoutError,
  SeamHttpApiError,
  SeamHttpEndpointPaginatedQueryPaths,
  SeamHttpEndpoints,
  SeamHttpInvalidInputError,
  SeamHttpRequest,
  SeamPageCursor,
} from '@seamapi/http/connect'
import type { ActionAttempt } from '@seamapi/types/connect'
import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseSeamInfiniteQueryParameters<
  T extends SeamHttpEndpointPaginatedQueryPaths,
> = Parameters<SeamHttpEndpoints[T]>[0]

export type UseSeamInfiniteQueryResult<
  T extends SeamHttpEndpointPaginatedQueryPaths,
> = UseInfiniteQueryResult<QueryData<T>, QueryError<T>>

export function useSeamInfiniteQuery<
  T extends SeamHttpEndpointPaginatedQueryPaths,
>(
  endpointPath: T,
  parameters?: UseSeamInfiniteQueryParameters<T>,
  options: Parameters<SeamHttpEndpoints[T]>[1] &
    QueryOptions<QueryData<T>, QueryError<T>> = {}
): UseSeamInfiniteQueryResult<T> {
  const { endpointClient: client, queryKeyPrefixes } = useSeamClient()
  return useInfiniteQuery({
    enabled: client != null,
    ...options,
    queryKey: [
      ...queryKeyPrefixes,
      ...endpointPath.split('/').filter((v) => v !== ''),
      parameters,
    ],
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextPageCursor,
    queryFn: async ({ pageParam }) => {
      if (client == null)
        return {
          data: [] as Awaited<ReturnType<SeamHttpEndpoints[T]>>,
          nextPageCursor: null,
        }
      // Using @ts-expect-error over any is preferred, but not possible here because TypeScript will run out of memory.
      // Type assertion is needed here for performance reasons. The types are correct at runtime.
      const endpoint = client[endpointPath] as (...args: any) => any
      const request = endpoint(parameters, options)
      const pages = client.createPaginator(request as SeamHttpRequest<any, any>)
      if (pageParam == null) {
        const [data, { nextPageCursor }] = await pages.firstPage()
        return {
          data: data as Awaited<ReturnType<SeamHttpEndpoints[T]>>,
          nextPageCursor,
        }
      }
      // Type assertion is needed for pageParam since the Seam API expects a branded PageCursor type.
      const [data, { nextPageCursor }] = await pages.nextPage(
        pageParam as SeamPageCursor
      )
      return {
        data: data as Awaited<ReturnType<SeamHttpEndpoints[T]>>,
        nextPageCursor,
      }
    },
  })
}

interface QueryData<T extends SeamHttpEndpointPaginatedQueryPaths> {
  data: Awaited<ReturnType<SeamHttpEndpoints[T]>>
  nextPageCursor: SeamPageCursor | null
}

type QueryError<T extends SeamHttpEndpointPaginatedQueryPaths> =
  | Error
  | SeamHttpApiError
  | SeamHttpInvalidInputError
  | (QueryData<T>['data'] extends ActionAttempt
      ?
          | SeamActionAttemptFailedError<QueryData<T>['data']>
          | SeamActionAttemptTimeoutError<QueryData<T>['data']>
      : never)

type QueryOptions<X, Y> = Omit<
  UseInfiniteQueryOptions<X, Y>,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>
