import { useQuery } from '@tanstack/react-query'

import {
  type EcosystemApiError,
  fetchEcosystem,
} from 'lib/seam/ecosystem/client.js'
import { useEcosystemContext } from 'lib/seam/ecosystem/EcosystemProvider.js'
import type {
  DeviceModel,
  DeviceModelsListResponse,
} from 'lib/seam/ecosystem/types.js'
import {
  retryEcosystemQuery,
  type UseEcosystemQueryResult,
} from 'lib/seam/ecosystem/use-ecosystem-query-result.js'

export interface UseEcosystemDeviceModelsParams {
  /** DeviceDB manufacturer slug, e.g., `schlage`. */
  manufacturer?: string | undefined
  /** DeviceDB device type slug, e.g., `smartlock`. */
  deviceType?: string | undefined
  /** DeviceDB provider slug, e.g., `salto-ks`. */
  provider?: string | undefined
  /** Only device models with a computed capability of this name. */
  capability?: string | undefined
  /** Set to false to wait before fetching. */
  enabled?: boolean | undefined
}

export type UseEcosystemDeviceModelsData = DeviceModel[]

const pageSize = 500
const maxPages = 20

/**
 * Published device models from Ecosystem `GET /v1/device_models/list`,
 * following pagination to return every matching model.
 */
export function useEcosystemDeviceModels({
  manufacturer = '',
  deviceType = '',
  provider = '',
  capability = '',
  enabled = true,
}: UseEcosystemDeviceModelsParams = {}): UseEcosystemQueryResult<
  'deviceModels',
  UseEcosystemDeviceModelsData
> {
  const { embedKey, endpoint } = useEcosystemContext()

  const params = {
    manufacturer: manufacturer.trim(),
    device_type: deviceType.trim(),
    provider: provider.trim(),
    capability: capability.trim(),
  }

  const { data, ...rest } = useQuery<
    UseEcosystemDeviceModelsData,
    EcosystemApiError
  >({
    enabled,
    queryKey: [
      'ecosystem',
      endpoint,
      embedKey ?? null,
      'device_models',
      'list',
      params,
    ],
    queryFn: async ({ signal }) => {
      const deviceModels: DeviceModel[] = []
      let pageCursor: string | undefined
      for (let page = 0; page < maxPages; page++) {
        const res = await fetchEcosystem<DeviceModelsListResponse>(
          'device_models/list',
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
