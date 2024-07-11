import type { Device } from '@seamapi/types/connect'
import classNames from 'classnames'

import type { UseDevicesParams } from 'lib/seam/devices/use-devices.js'
import { BatteryStatusIndicator } from 'lib/ui/device/BatteryStatusIndicator.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { LockStatus } from 'lib/ui/device/LockStatus.js'
import {
  isDeviceAccountOffline,
  OnlineStatus,
} from 'lib/ui/device/OnlineStatus.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { Title } from 'lib/ui/typography/Title.js'

export type DeviceTableProps = Props & UseDevicesParams

interface Props {
  onBack: (() => void) | undefined
}

interface DeviceRowProps {
  device: Device
  onClick: () => void
}

export function DeviceRow({
  device,
  onClick,
}: DeviceRowProps): JSX.Element | null {
  const isDeviceOffline = !device.properties.online
  const isDisconnected = isDeviceAccountOffline(device) || isDeviceOffline
  const isConnected = !isDisconnected

  return (
    <TableRow onClick={onClick}>
      <TableCell
        className={classNames('seam-image-cell', {
          'seam-offline-fade': isDisconnected,
        })}
      >
        <DeviceImage device={device} />
      </TableCell>
      <TableCell className='seam-body-cell'>
        <Title
          className={classNames('seam-truncated-text', {
            'seam-offline-fade': isDisconnected,
          })}
        >
          {device.properties.name}
        </Title>
        <div className='seam-bottom'>
          <span
            className={classNames('seam-device-model', {
              'seam-offline-fade': isDisconnected,
            })}
          >
            {device.properties.model.manufacturer_display_name}{' '}
            {device.properties.model.display_name}
          </span>
          <div className='seam-device-statuses'>
            <OnlineStatus device={device} />
            {isConnected && <BatteryStatusIndicator device={device} />}
            {isConnected && <LockStatus device={device} />}
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}
