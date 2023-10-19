import { SupportedDeviceRow } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceRow.js'
import type { UseDeviceModelsData } from 'lib/seam/components/SupportedDeviceTable/use-device-models.js'

interface SupportedDeviceContentRowsProps {
  deviceModels: UseDeviceModelsData
}

export function SupportedDeviceContentRows({
  deviceModels,
}: SupportedDeviceContentRowsProps): JSX.Element | null {
  return (
    <div className='seam-supported-device-table-content'>
      {deviceModels.map((deviceModel) => (
        <SupportedDeviceRow
          key={deviceModel.display_name}
          deviceModel={deviceModel}
        />
      ))}
    </div>
  )
}
