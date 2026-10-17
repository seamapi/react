import type { EcosystemElementProps } from 'lib/ecosystem-element.js'

import type { SupportedDevicesProps } from './SupportedDevices.js'

export const name = 'seam-supported-devices'

export const props: EcosystemElementProps<SupportedDevicesProps> = {
  manufacturer: 'string',
  deviceType: 'string',
  capability: 'string',
  hideSearch: 'boolean',
  hideFilters: 'boolean',
  hideTitle: 'boolean',
  theme: 'string',
}

export { SupportedDevices as Component } from './SupportedDevices.js'
