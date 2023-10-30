import type {
  DeviceModelV1,
  RouteRequestParams,
  RouteResponse,
} from '@seamapi/types/devicedb'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { SeamError } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDeviceModelsParams = DeviceModelsListParams
export type UseDeviceModelsData = DeviceModelV1[]

export function useDeviceModels(
  params?: UseDeviceModelsParams
): UseSeamQueryResult<'deviceModels', UseDeviceModelsData> {
  const { client: seam } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<
    DeviceModelsListResponse['device_models'],
    SeamError
  >({
    enabled: seam != null,
    queryKey: ['internal', 'device_models', 'list', params],
    queryFn: async () => {
      if (seam == null) return []
      const {
        data: { device_models: deviceModels },
      } = await seam.client.get<DeviceModelsListResponse>(
        '/internal/devicedb/v1/device_models/list',
        { params }
      )
      return deviceModels
    },
    onSuccess: (deviceModels) => {
      for (const deviceModel of deviceModels) {
        queryClient.setQueryData(
          [
            'internal',
            'device_models',
            'get',
            { device_model_id: deviceModel.device_model_id },
          ],
          deviceModel
        )
      }
    },
  })

  return { ...rest, deviceModels: data }
}

type DeviceModelsListParams = RouteRequestParams<'/v1/device_models/list'>

type DeviceModelsListResponse = RouteResponse<'/v1/device_models/list'>
