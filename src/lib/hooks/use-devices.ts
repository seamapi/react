import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  type DevicesListRequest,
  type DevicesListResponse,
  type SeamError
} from 'seamapi'

import { useSeam } from './use-seam.js'

export type UseDevicesParams = DevicesListRequest
export type UseDevicesData = DevicesListResponse['devices']

type Result = UseQueryResult<UseDevicesData, SeamError>

type UseDevicesResult = Omit<Result, 'data'> & { devices: Result['data'] }

export function useDevices(params: DevicesListRequest): UseDevicesResult {
  const { client } = useSeam()
  const { data, ...rest } = useQuery<DevicesListResponse['devices'], SeamError>(
    {
      enabled: client != null,
      queryKey: ['list', 'devices', params],
      queryFn: async () => {
        if (client == null) return []
        return await client?.devices.list(params)
      }
    }
  )

  return { ...rest, devices: data }
}
