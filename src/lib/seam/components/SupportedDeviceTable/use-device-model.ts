import type { SeamHttpApiError } from '@seamapi/http/connect'
import type {
  DeviceModel,
  RouteRequestParams,
  RouteResponse,
} from '@seamapi/types/devicedb'
import { useQuery } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDeviceModelParams = DeviceModelsGetParams

export type UseDeviceModelData = DeviceModel | null

export function useDeviceModel(
  params: UseDeviceModelParams
): UseSeamQueryResult<'deviceModel', UseDeviceModelData> {
  const { client: seam } = useSeamClient()
  const { data, ...rest } = useQuery<UseDeviceModelData, SeamHttpApiError>({
    enabled: seam != null,
    queryKey: ['internal', 'device_models', 'get', params],
    queryFn: async () => {
      if (seam == null) return null
      const {
        data: { device_model: deviceModel },
      } = await seam.client.get<DeviceModelsGetResponse>(
        '/internal/devicedb/v1/device_models/get',
        { params }
      )
      // UPSTREAM: Response type does not match DeviceModel.
      return deviceModel as DeviceModel
    },
  })

  return {
    ...rest,
    deviceModel: data,
  }
}

type DeviceModelsGetParams = RouteRequestParams<'/v1/device_models/get'>

type DeviceModelsGetResponse = RouteResponse<'/v1/device_models/get'>
