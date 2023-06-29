import type { DeviceModel } from 'seamapi'

import { useDeviceProvider } from 'lib/brands.js'
import {
  connectionTypeNames,
  ImageColumn,
  StatusColumn,
} from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceRow.js'
import { DotDivider } from 'lib/ui/layout/DotDivider.js'

export interface SupportedDeviceFilterResultRowProps {
  deviceModel: DeviceModel
}

export function SupportedDeviceFilterResultRow({
  deviceModel,
}: SupportedDeviceFilterResultRowProps): JSX.Element {
  return (
    <div className='seam-row filter-result-row'>
      <ImageColumn deviceModel={deviceModel} />
      <ModelColumn deviceModel={deviceModel} />
      <StatusColumn deviceModel={deviceModel} />
    </div>
  )
}

export function ModelColumn({
  deviceModel,
}: SupportedDeviceFilterResultRowProps) {
  const deviceProvider = useDeviceProvider(deviceModel.brand)

  return (
    <div className='seam-col seam-model-col'>
      <div className='seam-model-name'>
        <img
          src={deviceProvider.image_url}
          alt={deviceModel.brand}
          className='seam-brand-image'
        />{' '}
        {deviceModel.model_name}
      </div>
      <div className='seam-model-id'>
        {deviceModel.manufacturer_model_id}
        <DotDivider />
        {connectionTypeNames[deviceModel.connection_type]}
      </div>
    </div>
  )
}
