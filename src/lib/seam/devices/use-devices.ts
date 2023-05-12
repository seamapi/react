import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type {
  DevicesListRequest,
  DevicesListResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseDevicesParams = DevicesListRequest
export type UseDevicesData = DevicesListResponse['devices']

type Result = UseQueryResult<UseDevicesData, SeamError>

type UseDevicesResult = Omit<Result, 'data'> & { devices: Result['data'] }

export function useDevices(params: DevicesListRequest): UseDevicesResult {
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<DevicesListResponse['devices'], SeamError>(
    {
      enabled: client != null,
      queryKey: ['devices', 'list', params],
      queryFn: async () => {
        if (client == null) return []
        const devices = await client?.devices.list(params)
        return devices.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      },
    }
  )

  return { ...rest, devices: data }
}
