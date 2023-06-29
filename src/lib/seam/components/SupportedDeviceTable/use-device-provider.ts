import type { DeviceProvider } from 'seamapi'

import { useDeviceProviders } from 'lib/seam/devices/use-device-providers.js'

export function useDeviceProvider(brand: string): DeviceProvider {
  const { deviceProviders } = useDeviceProviders()

  const definedProvider = deviceProviders?.find(
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
