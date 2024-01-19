import type { ElementProps } from 'lib/element.js'

import type { DeviceTableProps } from './DeviceTable.js'

export const name = 'seam-device-table'

export const props: ElementProps<Omit<DeviceTableProps, 'title'>> = {
  deviceIds: 'array',
  connectedAccountIds: 'array',
  disableSearch: 'boolean',
  deviceFilter: 'object',
  deviceComparator: 'object',
  onDeviceClick: 'object',
  preventDefaultOnDeviceClick: 'boolean',
  heading: 'string',
  hideAccessCodes: 'boolean',
}

export { DeviceTable as Component } from './DeviceTable.js'
