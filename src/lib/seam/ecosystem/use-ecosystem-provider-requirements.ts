import { useQuery } from '@tanstack/react-query'

import { EcosystemApiError, fetchEcosystem } from 'lib/seam/ecosystem/client.js'
import { useEcosystemContext } from 'lib/seam/ecosystem/EcosystemProvider.js'
import type {
  ProviderRequirements,
  ProvidersListResponse,
} from 'lib/seam/ecosystem/types.js'
import {
  retryEcosystemQuery,
  type UseEcosystemQueryResult,
} from 'lib/seam/ecosystem/use-ecosystem-query-result.js'

/** Fetch provider branding, integration status, and legacy free-text requirements. */
export function useEcosystemProviderRequirements(
  slugs: string[]
): UseEcosystemQueryResult<'providers', ProviderRequirements[]> {
  const { endpoint, embedKey } = useEcosystemContext()
  const sortedSlugs = [...new Set(slugs)].sort()
  const { data, ...rest } = useQuery<ProviderRequirements[], EcosystemApiError>(
    {
      enabled: sortedSlugs.length > 0,
      queryKey: [
        'ecosystem',
        endpoint,
        embedKey ?? null,
        'providers',
        'list',
        { slugs: sortedSlugs },
      ],
      queryFn: async ({ signal }) => {
        const providers: ProviderRequirements[] = []
        const seen = new Set<string>()
        let cursor: string | undefined
        for (let page = 0; page < 10; page++) {
          const res = await fetchEcosystem<ProvidersListResponse>(
            'providers/list',
            {
              endpoint,
              embedKey,
              signal,
              params: { slugs: sortedSlugs, limit: 500, page_cursor: cursor },
            }
          )
          providers.push(...res.providers)
          if (!res.pagination.has_next_page) return providers
          const next = res.pagination.next_page_cursor
          if (next == null || seen.has(next)) break
          seen.add(next)
          cursor = next
        }
        throw new EcosystemApiError({
          status: 502,
          type: 'pagination_incomplete',
          message: 'The provider catalog returned incomplete requirements.',
        })
      },
      retry: retryEcosystemQuery,
    }
  )
  return { ...rest, providers: data }
}
