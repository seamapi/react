import { useQuery } from '@tanstack/react-query'
import type { DeviceProvider } from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export function useDeviceProvider(brand: string): DeviceProvider {
  const { client } = useSeamClient()

  const { data } = useQuery({
    queryFn: async () => {
      if (client == null) {
        return []
      }

      return await client?.devices.listDeviceProviders({})
    },
    queryKey: ['devices', 'list_device_providers'],
    enabled: client != null,
  })

  const definedProvider = data?.find(
    (provider) => provider.device_provider_name === brand
  )

  if (definedProvider != null) {
    return definedProvider
  }

  return {
    device_provider_name: 'unknown',
    display_name: 'Unknown',
    image_url: `https://connect.getseam.com/assets/images/logos/seam.png`,
    provider_categories: [],
  }
}
