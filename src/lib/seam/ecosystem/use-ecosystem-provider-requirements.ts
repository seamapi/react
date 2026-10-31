import { useQuery } from '@tanstack/react-query'

import { useEcosystemContext } from './EcosystemProvider.js'
import { providerRequirementsQuery } from './queries.js'
import type { ProviderRequirements } from './types.js'
import {
  retryEcosystemQuery,
  type UseEcosystemQueryResult,
} from './use-ecosystem-query-result.js'

/** Fetch provider branding, integration status, and legacy free-text requirements. */
export function useEcosystemProviderRequirements(
  slugs: string[]
): UseEcosystemQueryResult<'providers', ProviderRequirements[]> {
  const context = useEcosystemContext()
  const { data, ...rest } = useQuery({
    ...providerRequirementsQuery(context, slugs),
    enabled: slugs.length > 0,
    retry: retryEcosystemQuery,
  })
  return { ...rest, providers: data }
}
