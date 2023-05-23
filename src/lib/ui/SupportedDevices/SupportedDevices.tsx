import type { DeviceModel } from 'lib/ui/SupportedDevices/types.js'
import SupportedDeviceRow from './SupportedDeviceRow.js'
import SupportedDevicesHeader from './SupportedDevicesHeader.js'

export interface SupportedDevicesProps {
  // If true, only show devices that are actively
  // supported and considered stable.
  includeOnlySupportedDevices?: boolean
}

export default function SupportedDevices({}: SupportedDevicesProps) {
  const TEMP_supportedDevices: DeviceModel[] = [
    {
      main_category: 'Smart Lock',
      model_name: 'Wi-Fi Smart Lock',
      manufacturer_model_id: 'AUG-SL05-M01-S01',
      connection_type: 'Wi-Fi',
      support_level: 'Live',
      brand: 'August',
      icon_url:
        'https://www.seam.co/_next/image?url=%2Fimg%2Fdevice-db%2Faugust%2Fsmartlocks%2Faugust_wifi-smart-lock_silver_front.png&w=96&q=75',
      seam_device_model_page_url:
        'https://www.seam.co/device-db/august/smartlocks',
    },
    {
      main_category: 'Smart Lock',
      model_name: 'Wi-Fi Smart Lock',
      manufacturer_model_id: 'AUG-SL05-M01-S01',
      connection_type: 'Wi-Fi',
      support_level: 'Beta',
      brand: 'August',
      icon_url:
        'https://www.seam.co/_next/image?url=%2Fimg%2Fdevice-db%2Faugust%2Fsmartlocks%2Faugust_wifi-smart-lock_silver_front.png&w=96&q=75',
      seam_device_model_page_url:
        'https://www.seam.co/device-db/august/smartlocks',
    },
    {
      main_category: 'Smart Lock',
      model_name: 'Wi-Fi Smart Lock',
      manufacturer_model_id: 'AUG-SL05-M01-S01',
      connection_type: 'Wi-Fi',
      support_level: 'Unsupported',
      brand: 'August',
      icon_url:
        'https://www.seam.co/_next/image?url=%2Fimg%2Fdevice-db%2Faugust%2Fsmartlocks%2Faugust_wifi-smart-lock_silver_front.png&w=96&q=75',
      seam_device_model_page_url:
        'https://www.seam.co/device-db/august/smartlocks',
    },
  ]

  return (
    <table className='seam-supported-devices-table'>
      <SupportedDevicesHeader />
      <tbody>
        {TEMP_supportedDevices.map((deviceModel) => (
          <SupportedDeviceRow
            key={deviceModel.manufacturer_model_id}
            deviceModel={deviceModel}
          />
        ))}
      </tbody>
    </table>
  )
}
