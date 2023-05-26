import r2wc from '@r2wc/react-to-web-component'

import { SupportedDeviceTable } from './index.js'

const SupportedDeviceTableElement = r2wc(SupportedDeviceTable)

customElements.define(
  'seam-supported-device-table',
  SupportedDeviceTableElement
)
