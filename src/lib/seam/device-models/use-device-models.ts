import { useQuery } from '@tanstack/react-query'
import type {
  DeviceModel,
  DeviceModelsListRequest,
  DeviceModelsListResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDeviceModelsParams = DeviceModelsListRequest
export type UseDeviceModelsData = DeviceModel[]

export function useDeviceModels(
  params?: UseDeviceModelsParams
): UseSeamQueryResult<'deviceModels', UseDeviceModelsData> {
  const { client } = useSeamClient()

  const { data, ...rest } = useQuery<
    DeviceModelsListResponse['device_models'],
    SeamError
  >({
    enabled: client != null,
    queryKey: ['device_models', 'list', params],
    queryFn: async () => {
      if (client == null) return []
      const deviceModels = await client?.deviceModels.list(params)
      return deviceModels
    },
  })

  return { ...rest, deviceModels: data }
}
