import { useQuery } from '@tanstack/react-query'
import type {
  DeviceProvider,
  DeviceProvidersListRequest,
  DeviceProvidersListResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseDeviceProvidersParams = DeviceProvidersListRequest
export type UseDeviceProvidersData = DeviceProvider[]

export function useDeviceProviders(
  params?: UseDeviceProvidersParams
): UseSeamQueryResult<'deviceProviders', UseDeviceProvidersData> {
  const { client } = useSeamClient()

  const { data, ...rest } = useQuery<
    DeviceProvidersListResponse['device_providers'],
    SeamError
  >({
    enabled: client != null,
    queryKey: ['devices', 'list_device_providers', params],
    queryFn: async () => {
      if (client == null) return []
      return await client.devices.listDeviceProviders(params)
    },
  })

  return { ...rest, deviceProviders: data }
}
