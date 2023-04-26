import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type {
  DevicesListRequest,
  DevicesListResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'index.js'

export type UseDevicesParams = DevicesListRequest
export type UseDevicesData = DevicesListResponse['devices']

type Result = UseQueryResult<UseDevicesData, SeamError>

type UseDevicesResult = Omit<Result, 'data'> & { devices: Result['data'] }

export function useDevices(params: DevicesListRequest): UseDevicesResult {
  const { client } = useSeamClient()
  const { data, ...rest } = useQuery<DevicesListResponse['devices'], SeamError>(
    {
      enabled: client != null,
      queryKey: ['list', 'devices', params],
      queryFn: async () => {
        if (client == null) return []
        return await client?.devices.list(params)
      },
    }
  )

  return { ...rest, devices: data }
}
