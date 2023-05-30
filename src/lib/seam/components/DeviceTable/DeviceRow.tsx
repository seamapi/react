import { isLockDevice } from 'lib/seam/devices/types.js'
import type {
  UseDevicesData,
  UseDevicesParams,
} from 'lib/seam/devices/use-devices.js'
import { BatteryStatus } from 'lib/ui/device/BatteryStatus.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { LockStatus } from 'lib/ui/device/LockStatus.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { getDeviceModel } from 'lib/seam/components/DeviceDetails/DeviceModel.js'
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
  if (!isLockDevice(device)) {
    return null
  }

  const deviceModel = getDeviceModel(device) ?? t.unknownLock

  return (
    <TableRow key={device.device_id} onClick={onClick}>
      <TableCell className='seam-image-cell'>
        <DeviceImage device={device} />
      </TableCell>
      <TableCell className='seam-body-cell'>
        <Title className='seam-truncated-text'>{device.properties.name}</Title>
        <div className='seam-bottom'>
          <span className='seam-device-model'>{deviceModel}</span>
          <div className='seam-device-statuses'>
            <OnlineStatus device={device} />
            <BatteryStatus device={device} />
            <LockStatus device={device} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

const t = {
  devices: 'Devices',
  unknownLock: 'Unknown Lock',
  noDevicesMessage: 'Sorry, no devices were found',
}
