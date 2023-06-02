import type { ElementProps } from 'lib/element.js'

import type { DeviceDetailsProps } from './DeviceDetails.js'

export const name = 'seam-device-details'

export const props: ElementProps<DeviceDetailsProps> = {
  deviceId: 'string',
  onBack: 'function',
}

export { DeviceDetails as Component } from './DeviceDetails.js'
