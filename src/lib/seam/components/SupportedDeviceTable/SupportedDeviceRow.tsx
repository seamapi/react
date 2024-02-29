import type { DeviceModel } from '@seamapi/types/devicedb'
import classNames from 'classnames'

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
        <img
          width={40}
          src={deviceModel.aesthetic_variants[0]?.images[0]?.url}
        />
      </div>
    </div>
  )
}

export function ModelColumn({
  deviceModel,
}: SupportedDeviceRowProps): JSX.Element {
  const sku = deviceModel.aesthetic_variants[0]?.manufacturer_sku
  const connection =
    deviceModel.main_connection_type === 'unknown'
      ? null
      : deviceModel.main_connection_type
  return (
    <div className='seam-col seam-model-col'>
      <div className='seam-model-name'>
        <div className='seam-truncated-text'>{deviceModel.display_name}</div>
      </div>
      <div className='seam-model-id'>
        <div className='seam-truncated-text'>
          {sku}
          {sku != null && connection != null && <DotDivider />}
          {connection}
        </div>
      </div>
    </div>
  )
}

export function StatusColumn({
  deviceModel,
}: SupportedDeviceRowProps): JSX.Element {
  const statusColor =
    supportLevelColors[deviceModel.manufacturer.integration] ?? 'unknown'

  return (
    <div className='seam-col seam-status-col'>
      <div className={classNames('seam-status-pill', `status-${statusColor}`)}>
        <span>{status[deviceModel.manufacturer.integration]}</span>
      </div>
    </div>
  )
}

const supportLevelColors: Record<
  DeviceModel['manufacturer']['integration'],
  'green' | 'blue' | 'unknown'
> = {
  stable: 'green',
  beta: 'blue',
  planned: 'unknown',
  unsupported: 'unknown',
  inquire: 'unknown',
}

const status: Record<DeviceModel['manufacturer']['integration'], string> = {
  stable: 'LIVE',
  beta: 'BETA',
  unsupported: 'Inquire',
  planned: 'Inquire',
  inquire: 'Inquire',
}
