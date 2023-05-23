import classNames from 'classnames'
import type { DeviceModel } from 'lib/ui/SupportedDevices/types.js'

export interface SupportedDeviceRowProps {
  deviceModel: DeviceModel
}

export default function SupportedDeviceRow({
  deviceModel,
}: SupportedDeviceRowProps) {
  function getColorFromSupportLevel() {
    switch (deviceModel.support_level) {
      case 'Live':
        return 'green'
      case 'Beta':
        return 'blue'
      case 'Unsupported':
        return 'orange'
      default:
        return 'gray'
    }
  }

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
          className={classNames(
            'seam-status-pill',
            `status-${getColorFromSupportLevel()}`
          )}
        >
          <span>{deviceModel.support_level}</span>
        </div>
      </td>
    </tr>
  )
}
