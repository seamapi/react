import SupportedDeviceRow from './SupportedDeviceRow.js'
import SupportedDevicesHeader from './SupportedDevicesHeader.js'

export const SupportedDevices = () => {
  return (
    <table>
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
