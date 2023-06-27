import classNames from 'classnames'
import type { DeviceModel } from 'seamapi'

export interface SupportedDeviceRowProps {
  deviceModel: DeviceModel
}

export function SupportedDeviceRow({
  deviceModel,
}: SupportedDeviceRowProps): JSX.Element {
  const statusColor = supportLevelColors[deviceModel.support_level] ?? 'unknown'
  return (
    <tr>
      <td>
        <img width={40} src={deviceModel.icon_url} />
      </td>
      <td>{deviceModel.main_category}</td>
      <td>{deviceModel.model_name}</td>
      <td>{deviceModel.manufacturer_model_id}</td>
      <td>{connectionTypeNames[deviceModel.connection_type]}</td>
      <td>
        <div
          className={classNames('seam-status-pill', `status-${statusColor}`)}
        >
          <span>{status[deviceModel.support_level]}</span>
        </div>
      </td>
    </tr>
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

const connectionTypeNames: Record<DeviceModel['connection_type'], string> = {
  wifi: 'Wifi',
  zwave: 'Z-Wave',
  zigbee: 'Zigbee',
  unknown: 'Unknown',
}
