import { TableBody } from '@mui/material'
import { DeviceRow } from 'lib/seam/components/DeviceTable/DeviceRow.js'
import { title } from 'process'
import type { UseDeviceData } from '../../../hooks.js'
import { TableHeader } from '../Table/TableHeader.js'
import { ContentHeader } from '../layout/ContentHeader.js'

interface ClimateSettingScheduleDeviceSelectProps {
  devices: NonNullable<UseDeviceData>[]
  onBack?: () => void
  onSelect: (deviceId: string) => void
}

export const ClimateSettingScheduleDeviceSelect = ({
  devices,
  onBack,
  onSelect,
}: ClimateSettingScheduleDeviceSelectProps) => {
  return (
    <>
      <ContentHeader title={title} onBack={onBack} />
      <div className='seam-main'>
        <TableHeader>{t.tableHeader}</TableHeader>
        <TableBody>
          {devices.map((device) => (
            <DeviceRow
              device={device}
              key={device.device_id}
              onClick={() => {
                onSelect(device.device_id)
              }}
            />
          ))}
        </TableBody>
      </div>
    </>
  )
}

const t = {
  tableHeader: 'Choose a device',
  done: 'Done',
}
