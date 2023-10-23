import type {
  DeviceModelV1,
  RouteRequestParams,
  RouteResponse,
} from '@seamapi/types/devicedb'
import { useQuery } from '@tanstack/react-query'
import type { SeamError } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDeviceModelParams = DeviceModelsGetParams | string
export type UseDeviceModelData = DeviceModelV1 | null

export function useDeviceModel(
  params?: UseDeviceModelParams
): UseSeamQueryResult<'deviceModel', UseDeviceModelData> {
  const normalizedParams =
    typeof params === 'string' ? { device_model_id: params } : params

  const { client: seam } = useSeamClient()
  const { data, ...rest } = useQuery<
    DeviceModelsGetResponse['device_model'] | null,
    SeamError
  >({
    enabled: seam != null,
    queryKey: ['internal', 'device_models', 'get', normalizedParams],
    queryFn: async () => {
      if (seam == null) return null
      const {
        data: { device_model: deviceModel },
      } = await seam.client.get<DeviceModelsGetResponse>(
        '/internal/devicedb/v1/device_models/get',
        { params: normalizedParams }
      )
      return deviceModel
    },
  })

  return { ...rest, deviceModel: data }
}

type DeviceModelsGetParams = RouteRequestParams<'/v1/device_models/get'>

type DeviceModelsGetResponse = RouteResponse<'/v1/device_models/get'>
