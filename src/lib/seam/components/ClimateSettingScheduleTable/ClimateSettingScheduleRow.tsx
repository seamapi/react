import { ClimateSettingScheduleIcon } from 'lib/icons/ClimateSettingSchedule.js'
import type {
  UseClimateSettingSchedulesData,
  UseClimateSettingSchedulesParams,
} from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedules.js'

// import { ClimateSettingScheduleImage } from 'lib/ui/ClimateSettingSchedule/ClimateSettingScheduleImage.js'
// import { isClimateSettingScheduleAccountOffline } from 'lib/ui/ClimateSettingSchedule/OnlineStatus.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { Title } from 'lib/ui/typography/Title.js'
import { DateTime } from 'luxon'
import type { CommonDevice } from 'seamapi'

export type ClimateSettingScheduleTableProps = Props &
  UseClimateSettingSchedulesParams

interface Props {
  onBack?: () => void
}

interface ClimateSettingScheduleRowProps {
  climateSettingSchedule: UseClimateSettingSchedulesData[number]
  device: CommonDevice
  onClick: () => void
}

export function ClimateSettingScheduleRow({
  climateSettingSchedule,
  device,
  onClick,
}: ClimateSettingScheduleRowProps): JSX.Element | null {
  const startDate = DateTime.fromISO(
    climateSettingSchedule.schedule_starts_at
  ).toLocaleString({
    month: 'short',
    day: 'numeric',
  })

  return (
    <TableRow onClick={onClick}>
      <TableCell>
        <ClimateSettingScheduleIcon />
      </TableCell>
      <TableCell className='seam-body-cell'>
        <Title>{climateSettingSchedule.name}</Title>
        <div className='seam-bottom'>
          <div className='seam-device-statuses'>
            <span className='seam-status-text'>{device.properties.name}</span>
            <span className='seam-status-text'>{`Starts ${startDate}`}</span>
            <span className='seam-status-text'>{`70\u00B0F`}</span>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}
