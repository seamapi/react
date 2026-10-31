import { useQuery } from '@tanstack/react-query'

import { useEcosystemContext } from './EcosystemProvider.js'
import { deviceModelSummariesQuery } from './queries.js'
import type { DeviceModelSummary } from './types.js'
import type { UseEcosystemDeviceModelsParams } from './use-ecosystem-device-models.js'
import {
  retryEcosystemQuery,
  type UseEcosystemQueryResult,
} from './use-ecosystem-query-result.js'

export type UseEcosystemDeviceModelSummariesParams =
  UseEcosystemDeviceModelsParams & {
    /** Fetch specific models, including accessories from other manufacturers. */
    slugs?: string[] | undefined
  }

export type UseEcosystemDeviceModelSummariesData = DeviceModelSummary[]

/** Published slim summaries, following pagination to return every matching model. */
export function useEcosystemDeviceModelSummaries({
  enabled = true,
  ...filters
}: UseEcosystemDeviceModelSummariesParams = {}): UseEcosystemQueryResult<
  'deviceModels',
  UseEcosystemDeviceModelSummariesData
> {
  const context = useEcosystemContext()
  const { data, ...rest } = useQuery({
    ...deviceModelSummariesQuery(context, filters),
    enabled,
    retry: retryEcosystemQuery,
  })
  return { ...rest, deviceModels: data }
}
