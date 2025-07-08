import type { SeamHttpApiError } from '@seamapi/http/connect'
import type {
  DeviceModel,
  RouteRequestParams,
  RouteResponse,
} from '@seamapi/types/devicedb'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useSeamClient } from '@seamapi/react-query'
import type { UseSeamQueryResultLegacy } from 'lib/seam/use-seam-query-result.js'

export type UseDeviceModelsParams = DeviceModelsListParams

export type UseDeviceModelsData = DeviceModel[]

export function useDeviceModels(
  params?: UseDeviceModelsParams
): UseSeamQueryResultLegacy<'deviceModels', UseDeviceModelsData> {
  const { client: seam } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<UseDeviceModelsData, SeamHttpApiError>({
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
      // UPSTREAM: Response type does not match DeviceModel[].
      return deviceModels as DeviceModel[]
    },
  })

  return {
    ...rest,
    deviceModels: data,
  }
}

type DeviceModelsListParams = RouteRequestParams<'/v1/device_models/list'>

type DeviceModelsListResponse = RouteResponse<'/v1/device_models/list'>
