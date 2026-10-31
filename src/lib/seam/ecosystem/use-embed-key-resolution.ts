import { useQuery } from '@tanstack/react-query'

import { useEcosystemContext } from './EcosystemProvider.js'
import { embedResolutionQuery } from './queries.js'
import type { EmbedResolution } from './types.js'
import {
  retryEcosystemQuery,
  type UseEcosystemQueryResult,
} from './use-ecosystem-query-result.js'

export { getEmbedKeyManufacturer } from './embed-resolution.js'

export interface UseEmbedKeyResolutionParams {
  /** Resolve the partner's capability exclusions for this capability. */
  capability?: string | undefined
}

export type UseEmbedKeyResolutionData = EmbedResolution

/** Validates the embed key and resolves its manufacturer scope and exclusions. */
export function useEmbedKeyResolution({
  capability = '',
}: UseEmbedKeyResolutionParams = {}): UseEcosystemQueryResult<
  'embedResolution',
  UseEmbedKeyResolutionData
> {
  const context = useEcosystemContext()
  const { data, ...rest } = useQuery({
    ...embedResolutionQuery(context, capability),
    enabled: context.embedKey != null,
    retry: retryEcosystemQuery,
  })
  return { ...rest, embedResolution: data }
}
