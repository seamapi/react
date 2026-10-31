import { defaultEcosystemEndpoint } from './client.js'
import type { EcosystemOptions } from './EcosystemProvider.js'

export const normalizeEcosystemOptions = ({
  embedKey,
  ecosystemEndpoint,
}: EcosystemOptions): { embedKey: string | undefined; endpoint: string } => {
  const endpoint =
    normalizeOptionalString(ecosystemEndpoint) ?? defaultEcosystemEndpoint
  return {
    embedKey: normalizeOptionalString(embedKey),
    endpoint: endpoint.endsWith('/') ? endpoint : `${endpoint}/`,
  }
}

export const normalizeOptionalString = (
  value: string | undefined
): string | undefined => {
  const trimmed = value?.trim()
  return trimmed == null || trimmed.length === 0 ? undefined : trimmed
}
