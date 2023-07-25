import type { ElementProps } from 'lib/element.js'

import type { DeviceTableProps } from './DeviceTable.js'

export const name = 'seam-device-table'

export const props: ElementProps<Omit<DeviceTableProps, 'title'>> = {
  deviceIds: 'json',
  connectedAccountIds: 'json',
  disableLockUnlock: 'boolean',
  disableSearch: 'boolean',
  deviceFilter: 'function',
  deviceComparator: 'function',
  onDeviceClick: 'function',
  preventDefaultOnDeviceClick: 'boolean',
  onBack: 'function',
  heading: 'string',
  className: 'string',
}

export { DeviceTable as Component } from './DeviceTable.js'
