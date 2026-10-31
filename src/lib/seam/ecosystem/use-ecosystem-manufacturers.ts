import { useQuery } from '@tanstack/react-query'

import { useEcosystemContext } from './EcosystemProvider.js'
import { manufacturersQuery } from './queries.js'
import type { Manufacturer } from './types.js'
import {
  retryEcosystemQuery,
  type UseEcosystemQueryResult,
} from './use-ecosystem-query-result.js'

export interface UseEcosystemManufacturersParams {
  /** Only manufacturers with these slugs. */
  slugs?: string[] | undefined
  /** Set to false to wait before fetching. */
  enabled?: boolean | undefined
}

export type UseEcosystemManufacturersData = Manufacturer[]

/** Published manufacturers, following pagination to return every matching manufacturer. */
export function useEcosystemManufacturers({
  slugs,
  enabled = true,
}: UseEcosystemManufacturersParams = {}): UseEcosystemQueryResult<
  'manufacturers',
  UseEcosystemManufacturersData
> {
  const context = useEcosystemContext()
  const { data, ...rest } = useQuery({
    ...manufacturersQuery(context, slugs),
    enabled: enabled && (slugs == null || slugs.length > 0),
    retry: retryEcosystemQuery,
  })
  return { ...rest, manufacturers: data }
}
