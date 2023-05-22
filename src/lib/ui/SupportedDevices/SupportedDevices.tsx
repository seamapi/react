import SupportedDeviceRow from './SupportedDeviceRow.js'
import SupportedDevicesHeader from './SupportedDevicesHeader.js'

export default function SupportedDevices() {
  return (
    <table className='seam-supported-devices-table'>
      <SupportedDevicesHeader />
      <tbody>
        <SupportedDeviceRow />
        <SupportedDeviceRow />
        <SupportedDeviceRow />
        <SupportedDeviceRow />
        <SupportedDeviceRow />
      </tbody>
    </table>
  )
}
