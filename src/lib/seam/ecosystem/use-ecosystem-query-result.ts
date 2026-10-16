import type { UseQueryResult } from '@tanstack/react-query'

import type { EcosystemApiError } from 'lib/seam/ecosystem/client.js'

export type UseEcosystemQueryResult<Field extends string, Data> = Omit<
  UseQueryResult<Data, EcosystemApiError>,
  'data'
> & {
  [key in Field]?: Data
}

/** Retry server and network errors, but not client errors such as an invalid embed key. */
export const retryEcosystemQuery = (
  failureCount: number,
  error: EcosystemApiError
): boolean => {
  if (error.status >= 400 && error.status < 500) return false
  return failureCount < 2
}
