import type { FetchQueryOptions } from '@tanstack/react-query'

import {
  EcosystemApiError,
  type EcosystemRequestOptions,
  fetchEcosystem,
} from './client.js'
import type {
  DeviceModelSummariesListResponse,
  DeviceModelSummary,
  EmbedResolution,
  Manufacturer,
  ManufacturersListResponse,
  ProviderRequirements,
  ProvidersListResponse,
} from './types.js'

type QueryOptions<T> = FetchQueryOptions<T, EcosystemApiError>

type QueryContext = Omit<EcosystemRequestOptions, 'params' | 'signal'>

export interface DeviceModelSummaryFilters {
  manufacturer?: string
  provider?: string
  deviceType?: string
  capability?: string
  slugs?: string[]
}

// Reuse server data on hydration instead of immediately fetching it again.
const staleTime = 60_000

export const deviceModelSummariesQuery = (
  context: QueryContext,
  {
    manufacturer = '',
    deviceType = '',
    provider = '',
    capability = '',
    slugs = [],
  }: DeviceModelSummaryFilters = {}
): QueryOptions<DeviceModelSummary[]> => {
  const params = {
    manufacturer: manufacturer.trim(),
    device_type: deviceType.trim(),
    provider: provider.trim(),
    capability: capability.trim(),
    slugs: [
      ...new Set(slugs.map((slug) => slug.trim()).filter(Boolean)),
    ].sort(),
  }
  return {
    queryKey: [
      'ecosystem',
      context.endpoint,
      context.embedKey ?? null,
      'device_models',
      'summaries',
      'list',
      params,
    ],
    staleTime,
    queryFn: async ({ signal }) => {
      const models: DeviceModelSummary[] = []
      const cursors = new Set<string>()
      let cursor: string | undefined
      for (let page = 0; page < 20; page++) {
        const res = await fetchEcosystem<DeviceModelSummariesListResponse>(
          'device_models/summaries/list',
          {
            ...context,
            signal,
            params: { ...params, limit: 500, page_cursor: cursor },
          }
        )
        models.push(...res.device_models)
        if (!res.pagination.has_next_page) return models
        const next = res.pagination.next_page_cursor
        if (next == null || cursors.has(next)) break
        cursors.add(next)
        cursor = next
      }
      throw incompleteCatalog('The device catalog returned incomplete results.')
    },
  }
}

export const embedResolutionQuery = (
  context: QueryContext,
  capability = ''
): QueryOptions<EmbedResolution> => {
  const params = { capability: capability.trim() }
  return {
    queryKey: [
      'ecosystem',
      context.endpoint,
      context.embedKey ?? null,
      'embed',
      'resolve',
      params,
    ],
    staleTime,
    queryFn: async ({ signal }) =>
      await fetchEcosystem<EmbedResolution>('embed/resolve', {
        ...context,
        params,
        signal,
      }),
  }
}

export const providerRequirementsQuery = (
  context: QueryContext,
  slugs: string[]
): QueryOptions<ProviderRequirements[]> => {
  const sortedSlugs = [...new Set(slugs)].sort()
  return {
    queryKey: [
      'ecosystem',
      context.endpoint,
      context.embedKey ?? null,
      'providers',
      'list',
      { slugs: sortedSlugs },
    ],
    staleTime,
    queryFn: async ({ signal }) => {
      const providers: ProviderRequirements[] = []
      const cursors = new Set<string>()
      let cursor: string | undefined
      for (let page = 0; page < 10; page++) {
        const res = await fetchEcosystem<ProvidersListResponse>(
          'providers/list',
          {
            ...context,
            signal,
            params: { slugs: sortedSlugs, limit: 500, page_cursor: cursor },
          }
        )
        providers.push(...res.providers)
        if (!res.pagination.has_next_page) return providers
        const next = res.pagination.next_page_cursor
        if (next == null || cursors.has(next)) break
        cursors.add(next)
        cursor = next
      }
      throw incompleteCatalog(
        'The provider catalog returned incomplete requirements.'
      )
    },
  }
}

export const manufacturersQuery = (
  context: QueryContext,
  slugs?: string[]
): QueryOptions<Manufacturer[]> => {
  const sortedSlugs =
    slugs == null
      ? null
      : [...new Set(slugs)].sort((a, b) => a.localeCompare(b))
  return {
    queryKey: [
      'ecosystem',
      context.endpoint,
      context.embedKey ?? null,
      'manufacturers',
      'list',
      { slugs: sortedSlugs },
    ],
    staleTime,
    queryFn: async ({ signal }) => {
      const manufacturers: Manufacturer[] = []
      const cursors = new Set<string>()
      let cursor: string | undefined
      for (let page = 0; page < 10; page++) {
        const res = await fetchEcosystem<ManufacturersListResponse>(
          'manufacturers/list',
          {
            ...context,
            signal,
            params: {
              slugs: sortedSlugs ?? undefined,
              limit: 500,
              page_cursor: cursor,
            },
          }
        )
        manufacturers.push(...res.manufacturers)
        if (!res.pagination.has_next_page) return manufacturers
        const next = res.pagination.next_page_cursor
        if (next == null || cursors.has(next)) break
        cursors.add(next)
        cursor = next
      }
      throw incompleteCatalog(
        'The manufacturer catalog returned incomplete results.'
      )
    },
  }
}

const incompleteCatalog = (message: string): EcosystemApiError =>
  new EcosystemApiError({ status: 502, type: 'pagination_incomplete', message })
