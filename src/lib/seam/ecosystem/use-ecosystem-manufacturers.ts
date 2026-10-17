import { useQuery } from '@tanstack/react-query'

import {
  type EcosystemApiError,
  fetchEcosystem,
} from 'lib/seam/ecosystem/client.js'
import { useEcosystemContext } from 'lib/seam/ecosystem/EcosystemProvider.js'
import type {
  Manufacturer,
  ManufacturersListResponse,
} from 'lib/seam/ecosystem/types.js'
import {
  retryEcosystemQuery,
  type UseEcosystemQueryResult,
} from 'lib/seam/ecosystem/use-ecosystem-query-result.js'

export interface UseEcosystemManufacturersParams {
  /** Only manufacturers with these slugs. */
  slugs?: string[] | undefined
  /** Set to false to wait before fetching. */
  enabled?: boolean | undefined
}

export type UseEcosystemManufacturersData = Manufacturer[]

const pageSize = 500
const maxPages = 10

/** Published manufacturers from Ecosystem `GET /v1/manufacturers/list`. */
export function useEcosystemManufacturers({
  slugs,
  enabled = true,
}: UseEcosystemManufacturersParams = {}): UseEcosystemQueryResult<
  'manufacturers',
  UseEcosystemManufacturersData
> {
  const { embedKey, endpoint } = useEcosystemContext()

  const sortedSlugs =
    slugs == null
      ? null
      : [...new Set(slugs)].sort((a, b) => a.localeCompare(b))

  const { data, ...rest } = useQuery<
    UseEcosystemManufacturersData,
    EcosystemApiError
  >({
    enabled: enabled && (sortedSlugs == null || sortedSlugs.length > 0),
    queryKey: [
      'ecosystem',
      endpoint,
      embedKey ?? null,
      'manufacturers',
      'list',
      { slugs: sortedSlugs },
    ],
    queryFn: async ({ signal }) => {
      const manufacturers: Manufacturer[] = []
      let pageCursor: string | undefined
      for (let page = 0; page < maxPages; page++) {
        const res = await fetchEcosystem<ManufacturersListResponse>(
          'manufacturers/list',
          {
            endpoint,
            embedKey,
            params: {
              slugs: sortedSlugs ?? undefined,
              limit: pageSize,
              page_cursor: pageCursor,
            },
            signal,
          }
        )
        manufacturers.push(...res.manufacturers)
        const { has_next_page: hasNextPage, next_page_cursor: nextPageCursor } =
          res.pagination
        if (!hasNextPage || nextPageCursor == null) break
        pageCursor = nextPageCursor
      }
      return manufacturers
    },
    retry: retryEcosystemQuery,
  })

  return { ...rest, manufacturers: data }
}
