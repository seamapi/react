import type { DevicesListParams, SeamHttpApiError } from '@seamapi/http/connect'
import type { Device } from '@seamapi/types/connect'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResultLegacy } from 'lib/seam/use-seam-query-result.js'

export type UseDevicesParams = DevicesListParams

export type UseDevicesData = Device[]

export function useDevices(
  params?: UseDevicesParams
): UseSeamQueryResultLegacy<'devices', UseDevicesData> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<UseDevicesData, SeamHttpApiError>({
    enabled: client != null,
    queryKey: ['devices', 'list', params],
    queryFn: async () => {
      if (client == null) return []
      const devices = await client.devices.list(params)
      for (const device of devices) {
        queryClient.setQueryData(
          ['devices', 'get', { device_id: device.device_id }],
          device
        )
      }
      return devices
    },
  })

  return { ...rest, devices: data }
}
