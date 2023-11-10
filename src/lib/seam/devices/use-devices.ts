import type {
  DevicesListBody,
  DevicesListResponse,
} from '@seamapi/http/connect'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDevicesParams = DevicesListBody
export type UseDevicesData = DevicesListResponse

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
        return await client.devices.list(params)
      },
      onSuccess: (devices) => {
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
