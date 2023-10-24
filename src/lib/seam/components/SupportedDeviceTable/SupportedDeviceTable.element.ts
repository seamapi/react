import type { ElementProps } from 'lib/element.js'

import type { SupportedDeviceTableProps } from './SupportedDeviceTable.js'

export const name = 'seam-supported-device-table'

export const props: ElementProps<SupportedDeviceTableProps> = {
  disableFilter: 'boolean',
  manufacturers: 'array',
  excludedManufacturers: 'array',
}

export { SupportedDeviceTable as Component } from './SupportedDeviceTable.js'
