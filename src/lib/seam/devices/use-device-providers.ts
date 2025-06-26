import type {
  DevicesListDeviceProvidersParams,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import type { DeviceProvider } from '@seamapi/types/connect'
import { useQuery } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResultLegacy } from 'lib/seam/use-seam-query-result.js'

export type UseDeviceProvidersParams = DevicesListDeviceProvidersParams

export type UseDeviceProvidersData = DeviceProvider[]

export function useDeviceProviders(
  params?: UseDeviceProvidersParams
): UseSeamQueryResultLegacy<'deviceProviders', UseDeviceProvidersData> {
  const { client } = useSeamClient()

  const { data, ...rest } = useQuery<UseDeviceProvidersData, SeamHttpApiError>({
    enabled: client != null,
    queryKey: ['devices', 'list_device_providers', params],
    queryFn: async () => {
      if (client == null) return []
      return await client.devices.listDeviceProviders(params)
    },
  })

  return { ...rest, deviceProviders: data }
}
