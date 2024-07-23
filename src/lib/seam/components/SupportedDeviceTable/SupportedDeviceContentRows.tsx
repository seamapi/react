import type { DeviceModel } from '@seamapi/types/devicedb'

import { SupportedDeviceRow } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceRow.js'

interface SupportedDeviceContentRowsProps {
  deviceModels: DeviceModel[]
}

export function SupportedDeviceContentRows({
  deviceModels,
}: SupportedDeviceContentRowsProps): JSX.Element | null {
  return (
    <div className='seam-supported-device-table-content'>
      {deviceModels.map((deviceModel) => (
        <SupportedDeviceRow
          key={deviceModel.device_model_id}
          deviceModel={deviceModel}
        />
      ))}
    </div>
  )
}
