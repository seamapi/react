import { useQuery } from '@tanstack/react-query'
import type {
  CommonDevice,
  DeviceGetRequest,
  DeviceGetResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDeviceParams = DeviceGetRequest | string
export type UseDeviceData = CommonDevice | null

export function useDevice(
  params: DeviceGetRequest
): UseSeamQueryResult<'device', UseDeviceData> {
  const normalizedParams =
    typeof params === 'string' ? { device_id: params } : params

  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<
    DeviceGetResponse['device'] | null,
    SeamError
  >({
    enabled: client != null,
    queryKey: ['devices', 'get', normalizedParams],
    queryFn: async () => {
      if (client == null) return null
      return await client?.devices.get(normalizedParams)
    },
  })

  return { ...rest, device: data }
}
