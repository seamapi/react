import type { DeviceModel } from 'seamapi'

import { getBrandInfo, getImage } from 'lib/brands.js'
import { SupportedDeviceRow } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceRow.js'

export interface SupportedDeviceRowProps {
  brand: string
  deviceModels: DeviceModel[]
}

export function SupportedDeviceBrandSection({
  brand,
  deviceModels,
}: SupportedDeviceRowProps): JSX.Element {
  const brandInfo = getBrandInfo(brand)
  return (
    <div className='seam-brand-section'>
      <div className='seam-header'>
        <img
          src={getImage(brandInfo)}
          alt={brand}
          className='seam-brand-image'
        />
        <h5 className='seam-brand-name'>
          {brandInfo.readableName} {t.devices}
        </h5>
      </div>
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
    </div>
  )
}

const t = {
  devices: 'Devices',
}
