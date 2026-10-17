import { useQuery } from '@tanstack/react-query'

import {
  type EcosystemApiError,
  fetchEcosystem,
} from 'lib/seam/ecosystem/client.js'
import { useEcosystemContext } from 'lib/seam/ecosystem/EcosystemProvider.js'
import type { EmbedResolution } from 'lib/seam/ecosystem/types.js'
import {
  retryEcosystemQuery,
  type UseEcosystemQueryResult,
} from 'lib/seam/ecosystem/use-ecosystem-query-result.js'

export interface UseEmbedKeyResolutionParams {
  /** Resolve the partner's capability exclusions for this capability. */
  capability?: string | undefined
}

export type UseEmbedKeyResolutionData = EmbedResolution

/**
 * Validates the provider's embed key against the page origin with
 * Ecosystem `GET /v1/embed/resolve` and returns the key's public record
 * and, for partner keys, what the partner's widgets must not show.
 * Disabled when there is no embed key.
 */
export function useEmbedKeyResolution({
  capability = '',
}: UseEmbedKeyResolutionParams = {}): UseEcosystemQueryResult<
  'embedResolution',
  UseEmbedKeyResolutionData
> {
  const { embedKey, endpoint } = useEcosystemContext()

  const params = { capability: capability.trim() }

  const { data, ...rest } = useQuery<
    UseEmbedKeyResolutionData,
    EcosystemApiError
  >({
    enabled: embedKey != null,
    queryKey: [
      'ecosystem',
      endpoint,
      embedKey ?? null,
      'embed',
      'resolve',
      params,
    ],
    queryFn: async ({ signal }) =>
      await fetchEcosystem<EmbedResolution>('embed/resolve', {
        endpoint,
        embedKey,
        params,
        signal,
      }),
    retry: retryEcosystemQuery,
  })

  return { ...rest, embedResolution: data }
}

/**
 * The manufacturer an embed key is scoped to, if any.
 * Prefers the `manufacturer_context` Ecosystem returns for manufacturer keys (DEVDB-439),
 * and falls back to the key's own `manufacturer_slug`.
 */
export const getEmbedKeyManufacturer = (
  resolution: EmbedResolution | null | undefined
): string | null => {
  if (resolution == null) return null
  const contextSlug = resolution.manufacturer_context?.manufacturer_slug
  if (contextSlug != null && contextSlug.length > 0) return contextSlug
  const { owner_kind: ownerKind, manufacturer_slug: slug } =
    resolution.embed_key
  if (ownerKind === 'manufacturer' && slug != null && slug.length > 0) {
    return slug
  }
  return null
}
