import type { SupportedDeviceContentProps } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceContent.js'
import { SupportedDeviceContent } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceContent.js'

export type SupportedDeviceTableProps = SupportedDeviceContentProps

export function SupportedDeviceTable(
  props: SupportedDeviceContentProps
): JSX.Element {
  return (
    <div className='seam-supported-device-table-content-wrap'>
      <SupportedDeviceContent {...props} />
    </div>
  )
}
