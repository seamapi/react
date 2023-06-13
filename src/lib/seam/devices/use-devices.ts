import { useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  DevicesListRequest,
  DevicesListResponse,
  SeamError,
} from 'seamapi'

import type { CommonDevice } from 'lib/seam/devices/types.js'
import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDevicesParams = DevicesListRequest
export type UseDevicesData = CommonDevice[]

export function useDevices(
  params?: UseDevicesParams
): UseSeamQueryResult<'devices', UseDevicesData> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<DevicesListResponse['devices'], SeamError>(
    {
      enabled: client != null,
      queryKey: ['devices', 'list', params],
      queryFn: async () => {
        if (client == null) return []
        return await client?.devices.list(params)
      },
      onSuccess: (devices) => {
        // Prime cache for each device.
        for (const device of devices) {
          queryClient.setQueryData(
            ['devices', 'get', { device_id: device.device_id }],
            device
          )
        }
      },
    }
  )

  return { ...rest, devices: data }
}
