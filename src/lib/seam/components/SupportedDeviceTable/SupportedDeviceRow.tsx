import classNames from 'classnames'
import type { DeviceModel } from 'seamapi'

import { capitalize } from 'lib/strings.js'

export interface SupportedDeviceRowProps {
  deviceModel: DeviceModel
}

export function SupportedDeviceRow({
  deviceModel,
}: SupportedDeviceRowProps): JSX.Element {
  const statusColor = supportLevelColors[deviceModel.support_level] ?? 'gray'
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
          <span>{capitalize(deviceModel.support_level)}</span>
        </div>
      </td>
    </tr>
  )
}

const supportLevelColors: Record<
  DeviceModel['support_level'],
  'green' | 'blue' | 'orange'
> = {
  live: 'green',
  beta: 'blue',
  unsupported: 'orange',
}

const connectionTypeNames: Record<DeviceModel['connection_type'], string> = {
  wifi: 'Wifi',
  zwave: 'Z-Wave',
  zigbee: 'Zigbee',
  unknown: 'Unknown',
}
