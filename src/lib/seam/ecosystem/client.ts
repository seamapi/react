import type { EcosystemErrorResponse } from './types.js'

export const defaultEcosystemEndpoint = 'https://ecosystem.seam.co/v1/'

export type EcosystemQueryParams = Record<
  string,
  string | number | boolean | string[] | null | undefined
>

export interface EcosystemRequestOptions {
  endpoint: string
  embedKey?: string | undefined
  params?: EcosystemQueryParams
  signal?: AbortSignal
}

/**
 * An error response from the Ecosystem API.
 * The `type` is the API error type, e.g., `embed_key_required`,
 * `invalid_embed_key` or `origin_not_allowed`.
 */
export class EcosystemApiError extends Error {
  readonly status: number
  readonly type: string
  readonly requestId: string | null

  constructor({
    status,
    type,
    message,
    requestId = null,
  }: {
    status: number
    type: string
    message: string
    requestId?: string | null
  }) {
    super(message)
    this.name = 'EcosystemApiError'
    this.status = status
    this.type = type
    this.requestId = requestId
  }
}

/** True when the error means the embed key is missing, invalid or not allowed here. */
export const isEmbedKeyError = (error: unknown): boolean =>
  error instanceof EcosystemApiError &&
  (error.status === 401 || error.status === 403)

export const getEcosystemUrl = (
  endpoint: string,
  path: string,
  params: EcosystemQueryParams = {}
): URL => {
  const base = endpoint.endsWith('/') ? endpoint : `${endpoint}/`
  const url = new URL(path, new URL(base, globalThis.location?.href))
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue
    if (Array.isArray(value)) {
      if (value.length === 0) continue
      url.searchParams.set(key, value.join(','))
      continue
    }
    if (typeof value === 'string' && value.length === 0) continue
    url.searchParams.set(key, String(value))
  }
  return url
}

export const fetchEcosystem = async <T>(
  path: string,
  { endpoint, embedKey, params, signal }: EcosystemRequestOptions
): Promise<T> => {
  const url = getEcosystemUrl(endpoint, path, params)

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (embedKey != null && embedKey.length > 0) {
    headers['X-Embed-Key'] = embedKey
  }

  const res = await globalThis.fetch(url, {
    headers,
    ...(signal == null ? {} : { signal }),
  })

  const body = (await res.json().catch(() => null)) as unknown

  if (!res.ok) {
    const error = isErrorResponse(body) ? body.error : null
    throw new EcosystemApiError({
      status: res.status,
      type: error?.type ?? 'unknown_error',
      message:
        error?.message ?? `Ecosystem request failed with status ${res.status}`,
      requestId: error?.request_id ?? null,
    })
  }

  if (body == null || typeof body !== 'object') {
    throw new EcosystemApiError({
      status: res.status,
      type: 'invalid_response',
      message: 'Ecosystem returned an invalid response',
    })
  }

  return body as T
}

const isErrorResponse = (body: unknown): body is EcosystemErrorResponse =>
  body != null &&
  typeof body === 'object' &&
  'error' in body &&
  body.error != null &&
  typeof body.error === 'object'
