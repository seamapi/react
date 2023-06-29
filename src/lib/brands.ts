import { useQuery } from '@tanstack/react-query'
import type { DeviceProvider } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export function useDeviceProvider(brand: string): {
  deviceProvider: DeviceProvider | undefined
  isLoading: boolean
} {
  const { client } = useSeamClient()

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      if (client == null) {
        return []
      }

      return await client?.devices.listDeviceProviders({})
    },
    queryKey: ['devices', 'list_device_providers'],
    enabled: client != null,
  })

  return {
    deviceProvider: data?.find(
      (provider) => provider.device_provider_name === brand
    ),
    isLoading,
  }
}
