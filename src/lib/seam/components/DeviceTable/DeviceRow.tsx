import type {
  UseDevicesData,
  UseDevicesParams,
} from 'lib/seam/devices/use-devices.js'
import { AccountOnlineStatus } from 'lib/ui/device/AccountOnlineStatus.js'
import { BatteryStatus } from 'lib/ui/device/BatteryStatus.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { DeviceOnlineStatus } from 'lib/ui/device/DeviceOnlineStatus.js'
import { LockStatus } from 'lib/ui/device/LockStatus.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { Title } from 'lib/ui/typography/Title.js'

export type DeviceTableProps = Props & UseDevicesParams

interface Props {
  onBack?: () => void
}

interface DeviceStatusesProps {
  device: UseDevicesData[number]
}

function accountIsOffline(device: UseDevicesData[number]): boolean {
  return (
    device.errors.filter((error) => 'is_connected_account_error' in error)
      .length > 0
  )
}

function deviceIsOffline(device: UseDevicesData[number]): boolean {
  return (
    device.errors.filter((error) => error.error_code === 'device_disconnected')
      .length > 0
  )
}

function DeviceStatuses({ device }: DeviceStatusesProps): JSX.Element | null {
  if (accountIsOffline(device)) {
    return (
      <div className='seam-device-statuses'>
        <AccountOnlineStatus device={device} />
      </div>
    )
  }
  if (deviceIsOffline(device)) {
    return (
      <div className='seam-device-statuses'>
        <DeviceOnlineStatus device={device} />
      </div>
    )
  }
  return (
    <div className='seam-device-statuses'>
      <DeviceOnlineStatus device={device} />
      <BatteryStatus device={device} />
      <LockStatus device={device} />
    </div>
  )
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
    accountIsOffline(device) || deviceIsOffline(device)
      ? 'seam-offline-fade'
      : ''
  return (
    <TableRow onClick={onClick}>
      <TableCell className={`seam-image-cell ${opacityClass}`}>
        <DeviceImage device={device} />
      </TableCell>
      <TableCell className='seam-body-cell'>
        <Title className={`seam-truncated-text ${opacityClass}`}>
          {device.properties.name}
        </Title>
        <div className='seam-bottom'>
          <span className={`seam-device-model ${opacityClass}`}>
            {device.properties.model.display_name}
          </span>
          <DeviceStatuses device={device} />
        </div>
      </TableCell>
    </TableRow>
  )
}
