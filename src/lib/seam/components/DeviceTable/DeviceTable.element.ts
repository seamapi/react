import type { ElementProps } from 'lib/element.js'

import type { DeviceTableProps } from './DeviceTable.js'

export const name = 'seam-device-table'

export const props: ElementProps<DeviceTableProps> = {
  onBack: 'function',
  onDeviceClick: 'function',
  className: 'string',
}

export { DeviceTable as Component } from './DeviceTable.js'
