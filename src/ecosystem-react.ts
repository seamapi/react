'use client'

// Native React entry point, including the Next.js client boundary, without
// registering custom elements or importing the Seam API client.
export {
  CompatibleApps,
  type CompatibleAppsProps,
} from './lib/seam/components/CompatibleApps/CompatibleApps.js'
export {
  SupportedDevices,
  type SupportedDevicesProps,
} from './lib/seam/components/SupportedDevices/SupportedDevices.js'
export {
  type EcosystemOptions,
  EcosystemProvider,
  type EcosystemProviderProps,
} from './lib/seam/ecosystem/EcosystemProvider.js'
