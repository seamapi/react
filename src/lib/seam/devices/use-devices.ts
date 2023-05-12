import { useQuery } from '@tanstack/react-query'
import type {
  CommonDeviceProperties,
  Device,
  DevicesListRequest,
  DevicesListResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDevicesParams = DevicesListRequest
export type UseDevicesData = Array<Device<CommonDeviceProperties>>

export function useDevices(
  params: UseDevicesParams
): UseSeamQueryResult<'devices', UseDevicesData> {
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<DevicesListResponse['devices'], SeamError>(
    {
      enabled: client != null,
      queryKey: ['devices', 'list', params],
      queryFn: async () => {
        if (client == null) return []
        return await client?.devices.list(params)
      },
    }
  )

  return { ...rest, devices: data }
}
