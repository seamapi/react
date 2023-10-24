import type { DeviceModelV1 } from '@seamapi/types/devicedb'

import {
  ImageColumn,
  StatusColumn,
} from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceRow.js'
import { DotDivider } from 'lib/ui/layout/DotDivider.js'

interface SupportedDeviceFilterResultRowProps {
  deviceModel: DeviceModelV1
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
  return (
    <div className='seam-col seam-model-col'>
      <div className='seam-model-name'>
        <img
          src={deviceModel.manufacturer.logo?.url}
          alt={deviceModel.manufacturer.display_name}
          className='seam-brand-image'
        />{' '}
        <div className='seam-truncated-text'>{deviceModel.display_name}</div>
      </div>
      <div className='seam-model-id'>
        <div className='seam-truncated-text'>
          {deviceModel.device_model_id}
          <DotDivider />
          {deviceModel.main_connection_type}
        </div>
      </div>
    </div>
  )
}
