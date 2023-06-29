import { SupportedDeviceRow } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceRow.js'
import { type UseDeviceModelsData } from 'lib/seam/device-models/use-device-models.js'

interface SupportedDeviceContentRowsProps {
  deviceModels: UseDeviceModelsData
}

export function SupportedDeviceContentRows({
  deviceModels,
}: SupportedDeviceContentRowsProps): JSX.Element | null {
  return (
    <div className='seam-supported-device-table-content'>
      {deviceModels.map((deviceModel, index) => (
        <SupportedDeviceRow
          key={[
            deviceModel.main_category,
            deviceModel.brand,
            deviceModel.model_name,
            deviceModel.manufacturer_model_id,
            index,
          ].join(':')}
          deviceModel={deviceModel}
        />
      ))}
    </div>
  )
}
