import classNames from 'classnames'

import type { DeviceModel } from 'lib/ui/SupportedDevices/types.js'

export interface SupportedDeviceRowProps {
  deviceModel: DeviceModel
}

export default function SupportedDeviceRow({
  deviceModel,
}: SupportedDeviceRowProps) {
  const statusColor = supportLevelColors[deviceModel.support_level] ?? 'gray'
  return (
    <tr>
      <td>
        <img style={{ width: 40 }} src={deviceModel.icon_url} />
      </td>
      <td>{deviceModel.main_category}</td>
      <td>{deviceModel.model_name}</td>
      <td>{deviceModel.manufacturer_model_id}</td>
      <td>{deviceModel.connection_type}</td>
      <td>
        <div
          className={classNames('seam-status-pill', `status-${statusColor}`)}
        >
          <span>{deviceModel.support_level}</span>
        </div>
      </td>
    </tr>
  )
}

const supportLevelColors = {
  Live: 'green',
  Beta: 'blue',
  Unsupported: 'orange',
}
