import type { ElementProps } from 'lib/element.js'

import type { SupportedDeviceTableProps } from './SupportedDeviceTable.js'

export const name = 'seam-supported-device-table'

export const props: ElementProps<SupportedDeviceTableProps> = {
  cannotFilter: 'boolean',
  disableFilter: 'boolean',
  brands: 'array',
  excludedBrands: 'array',
  className: 'string',
}

export { SupportedDeviceTable as Component } from './SupportedDeviceTable.js'
