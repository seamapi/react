import { isLockDevice } from 'lib/seam/devices/types.js'
import {
  useDevices,
  type UseDevicesData,
  type UseDevicesParams,
} from 'lib/seam/devices/use-devices.js'
import { BatteryStatus } from 'lib/ui/device/BatteryStatus.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { LockStatus } from 'lib/ui/device/LockStatus.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { getDeviceModel } from 'lib/ui/DeviceDetails/DeviceModel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { Title } from 'lib/ui/typography/Title.js'
import { useNavigation } from 'lib/use-navigation.js'

export type DeviceTableProps = Props & UseDevicesParams

interface Props {
  onBack?: () => void
}

export function DeviceTable({ onBack, ...props }: DeviceTableProps) {
  const { devices, isLoading, isError, error } = useDevices(props)
  const { show } = useNavigation()

  if (isLoading) return <p>...</p>
  if (isError) return <p>{error?.message}</p>
  if (devices == null) return null

  const deviceCount = devices.length

  return (
    <div className='seam-device-table'>
      <ContentHeader />
      <TableHeader>
        <TableTitle>
          {t.devices} <Caption>({deviceCount})</Caption>
        </TableTitle>
      </TableHeader>
      <TableBody>
        {devices.map((device) => (
          <DeviceRow
            device={device}
            key={device.device_id}
            onClick={() => {
              show({ name: 'device_detail', deviceId: device.device_id })
            }}
          />
        ))}
      </TableBody>
    </div>
  )
}

function DeviceRow(props: {
  device: UseDevicesData[number]
  onClick: () => void
}) {
  const { device, onClick } = props

  if (!isLockDevice(device)) return null

  const deviceModel = getDeviceModel(device) ?? t.unknownLock

  return (
    <TableRow key={device.device_id} onClick={onClick}>
      <TableCell className='seam-image-cell'>
        <DeviceImage device={device} />
      </TableCell>
      <TableCell className='seam-body-cell'>
        <Title>{device.properties.name}</Title>
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
}
