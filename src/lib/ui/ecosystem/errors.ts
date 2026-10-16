import { EcosystemApiError } from 'lib/seam/ecosystem/client.js'

/** A message for an Ecosystem error, and whether retrying could help. */
export const getEcosystemErrorMessage = (
  error: unknown,
  fallback: string
): { message: string; canRetry: boolean } => {
  if (error instanceof EcosystemApiError) {
    if (error.type === 'embed_key_required') {
      return { message: t.embedKeyRequired, canRetry: false }
    }
    if (error.type === 'origin_not_allowed') {
      return { message: t.originNotAllowed, canRetry: false }
    }
    if (error.status === 401) {
      return { message: t.invalidEmbedKey, canRetry: false }
    }
    if (error.status === 403) {
      return { message: t.originNotAllowed, canRetry: false }
    }
  }
  return { message: fallback, canRetry: true }
}

const t = {
  embedKeyRequired:
    'An embed key is required to show this list on this website.',
  invalidEmbedKey: 'The embed key is invalid or has been revoked.',
  originNotAllowed: 'The embed key is not allowed on this website.',
}
