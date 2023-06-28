import classNames from 'classnames'

import type {
  UseDevicesData,
  UseDevicesParams,
} from 'lib/seam/devices/use-devices.js'
import { BatteryStatus } from 'lib/ui/device/BatteryStatus.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { LockStatus } from 'lib/ui/device/LockStatus.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { Title } from 'lib/ui/typography/Title.js'

export type DeviceTableProps = Props & UseDevicesParams

interface Props {
  onBack?: () => void
}

interface DeviceRowProps {
  device: UseDevicesData[number]
  onClick: () => void
}

export function DeviceRow({
  device,
  onClick,
}: DeviceRowProps): JSX.Element | null {
  const opacityClass =
    isAccountOffline(device) || isDeviceOffline(device)
      ? 'seam-offline-fade'
      : undefined
  return (
    <TableRow onClick={onClick}>
      <TableCell className={classNames('seam-image-cell', opacityClass)}>
        <DeviceImage device={device} />
      </TableCell>
      <TableCell className='seam-body-cell'>
        <Title className={classNames('seam-truncated-text', opacityClass)}>
          {device.properties.name}
        </Title>
        <div className='seam-bottom'>
          <span className={classNames('seam-device-model', opacityClass)}>
            {device.properties.model.display_name}
          </span>
          <DeviceStatuses device={device} />
        </div>
      </TableCell>
    </TableRow>
  )
}

interface DeviceStatusesProps {
  device: UseDevicesData[number]
}

function DeviceStatuses({ device }: DeviceStatusesProps): JSX.Element | null {
  if (isAccountOffline(device) || isDeviceOffline(device)) {
    return (
      <div className='seam-device-statuses'>
        <OnlineStatus device={device} />
      </div>
    )
  }
  return (
    <div className='seam-device-statuses'>
      <OnlineStatus device={device} />
      <BatteryStatus device={device} />
      <LockStatus device={device} />
    </div>
  )
}

const isAccountOffline = (device: UseDevicesData[number]): boolean => {
  return (
    device.errors.filter((error) => error.error_code === 'account_disconnected')
      .length > 0
  )
}

const isDeviceOffline = (device: UseDevicesData[number]): boolean => {
  return (
    device.errors.filter((error) => error.error_code === 'device_disconnected')
      .length > 0
  )
}
