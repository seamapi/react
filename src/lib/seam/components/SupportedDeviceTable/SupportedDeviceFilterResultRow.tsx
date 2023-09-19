import type { DeviceModel } from 'seamapi'

import {
  connectionTypeNames,
  ImageColumn,
  StatusColumn,
} from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceRow.js'
import { useDeviceProvider } from 'lib/seam/components/SupportedDeviceTable/use-device-provider.js'
import { DotDivider } from 'lib/ui/layout/DotDivider.js'

interface SupportedDeviceFilterResultRowProps {
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
}: SupportedDeviceFilterResultRowProps): JSX.Element {
  const deviceProvider = useDeviceProvider(deviceModel.brand)

  return (
    <div className='seam-col seam-model-col'>
      <div className='seam-model-name'>
        <img
          src={deviceProvider.image_url}
          alt={deviceModel.brand}
          className='seam-brand-image'
        />{' '}
        <div className='seam-truncated-text'>{deviceModel.model_name}</div>
      </div>
      <div className='seam-model-id'>
        <div className='seam-truncated-text'>
          {deviceModel.manufacturer_model_id}
          <DotDivider />
          {connectionTypeNames[deviceModel.connection_type]}
        </div>
      </div>
    </div>
  )
}
