import type { EmbedResolution } from './types.js'

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
