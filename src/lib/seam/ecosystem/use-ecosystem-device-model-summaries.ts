import { useQuery } from '@tanstack/react-query'

import {
  type EcosystemApiError,
  fetchEcosystem,
} from 'lib/seam/ecosystem/client.js'
import { useEcosystemContext } from 'lib/seam/ecosystem/EcosystemProvider.js'
import type {
  DeviceModelSummariesListResponse,
  DeviceModelSummary,
} from 'lib/seam/ecosystem/types.js'
import type { UseEcosystemDeviceModelsParams } from 'lib/seam/ecosystem/use-ecosystem-device-models.js'
import {
  retryEcosystemQuery,
  type UseEcosystemQueryResult,
} from 'lib/seam/ecosystem/use-ecosystem-query-result.js'

export type UseEcosystemDeviceModelSummariesParams =
  UseEcosystemDeviceModelsParams

export type UseEcosystemDeviceModelSummariesData = DeviceModelSummary[]

const pageSize = 500
const maxPages = 20

/**
 * Published device models in the slim summary shape from Ecosystem
 * `GET /v1/device_models/summaries/list` (no commerce data),
 * following pagination to return every matching model.
 */
export function useEcosystemDeviceModelSummaries({
  manufacturer = '',
  deviceType = '',
  provider = '',
  capability = '',
  enabled = true,
}: UseEcosystemDeviceModelSummariesParams = {}): UseEcosystemQueryResult<
  'deviceModels',
  UseEcosystemDeviceModelSummariesData
> {
  const { embedKey, endpoint } = useEcosystemContext()

  const params = {
    manufacturer: manufacturer.trim(),
    device_type: deviceType.trim(),
    provider: provider.trim(),
    capability: capability.trim(),
  }

  const { data, ...rest } = useQuery<
    UseEcosystemDeviceModelSummariesData,
    EcosystemApiError
  >({
    enabled,
    queryKey: [
      'ecosystem',
      endpoint,
      embedKey ?? null,
      'device_models',
      'summaries',
      'list',
      params,
    ],
    queryFn: async ({ signal }) => {
      const deviceModels: DeviceModelSummary[] = []
      let pageCursor: string | undefined
      for (let page = 0; page < maxPages; page++) {
        const res = await fetchEcosystem<DeviceModelSummariesListResponse>(
          'device_models/summaries/list',
          {
            endpoint,
            embedKey,
            params: { ...params, limit: pageSize, page_cursor: pageCursor },
            signal,
          }
        )
        deviceModels.push(...res.device_models)
        const { has_next_page: hasNextPage, next_page_cursor: nextPageCursor } =
          res.pagination
        if (!hasNextPage || nextPageCursor == null) break
        pageCursor = nextPageCursor
      }
      return deviceModels
    },
    retry: retryEcosystemQuery,
  })

  return { ...rest, deviceModels: data }
}
