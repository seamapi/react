import SupportedDeviceRow from './SupportedDeviceRow.js'
import SupportedDevicesHeader from './SupportedDevicesHeader.js'

export const SupportedDevices = () => {
  return (
    <div className='seam-supported-devices-table'>
      <SupportedDevicesHeader />
      <tbody>
        <SupportedDeviceRow />
        <SupportedDeviceRow />
        <SupportedDeviceRow />
        <SupportedDeviceRow />
        <SupportedDeviceRow />
      </tbody>
    </div>
  )
}
