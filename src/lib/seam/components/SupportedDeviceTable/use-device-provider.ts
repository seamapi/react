import type { DeviceProvider } from 'seamapi'

import { useDeviceProviders } from 'lib/seam/devices/use-device-providers.js'

export function useDeviceProvider(name: string): DeviceProvider {
  const { deviceProviders } = useDeviceProviders()
  const provider = deviceProviders?.find((p) => p.device_provider_name === name)
  return provider ?? unknownProvider
}

const unknownProvider: DeviceProvider = {
  device_provider_name: 'unknown',
  display_name: 'Unknown',
  image_url: 'https://connect.getseam.com/assets/images/logos/seam.png',
  provider_categories: [],
}
