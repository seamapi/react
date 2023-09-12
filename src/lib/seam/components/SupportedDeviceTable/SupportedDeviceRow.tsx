import classNames from 'classnames'
import type { DeviceModel } from 'seamapi'

import { DotDivider } from 'lib/ui/layout/DotDivider.js'

interface SupportedDeviceRowProps {
  deviceModel: DeviceModel
}

export function SupportedDeviceRow({
  deviceModel,
}: SupportedDeviceRowProps): JSX.Element {
  return (
    <div className='seam-row'>
      <ImageColumn deviceModel={deviceModel} />
      <ModelColumn deviceModel={deviceModel} />
      <StatusColumn deviceModel={deviceModel} />
    </div>
  )
}

export function ImageColumn({
  deviceModel,
}: SupportedDeviceRowProps): JSX.Element {
  return (
    <div className='seam-col seam-device-image-col'>
      <div className='seam-image-box'>
        <img width={40} src={deviceModel.icon_url} />
      </div>
    </div>
  )
}

export function ModelColumn({
  deviceModel,
}: SupportedDeviceRowProps): JSX.Element {
  return (
    <div className='seam-col seam-model-col'>
      <div className='seam-model-name'>{deviceModel.model_name}</div>
      <div className='seam-model-id'>
        {deviceModel.manufacturer_model_id}
        <DotDivider />
        {connectionTypeNames[deviceModel.connection_type]}
      </div>
    </div>
  )
}

export function StatusColumn({
  deviceModel,
}: SupportedDeviceRowProps): JSX.Element {
  const statusColor = supportLevelColors[deviceModel.support_level] ?? 'unknown'

  return (
    <div className='seam-col seam-status-col'>
      <div className={classNames('seam-status-pill', `status-${statusColor}`)}>
        <span>
          {/* TODO devicedb should support this eventually, hardcoded for now */}
          {deviceModel.brand === 'lockly'
            ? brandStatus[deviceModel.brand]
            : status[deviceModel.support_level]}
        </span>
      </div>
    </div>
  )
}

const supportLevelColors: Record<
  DeviceModel['support_level'],
  'green' | 'blue' | 'unknown'
> = {
  live: 'green',
  beta: 'blue',
  unsupported: 'unknown',
}

const status: Record<DeviceModel['support_level'], string> = {
  live: 'LIVE',
  beta: 'BETA',
  unsupported: 'Inquire',
}

export const connectionTypeNames: Record<
  DeviceModel['connection_type'],
  string
> = {
  wifi: 'Wifi',
  zwave: 'Z-Wave',
  zigbee: 'Zigbee',
  unknown: 'Unknown',
}

export const brandStatus: Record<DeviceModel['brand'], string> = {
  lockly: 'LIVE/CONTACT SUPPORT',
}
