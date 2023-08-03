import { ClimateSettingScheduleIcon } from 'lib/icons/ClimateSettingSchedule.js'
import type { UseClimateSettingSchedulesData } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedules.js'

import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'
import { Title } from 'lib/ui/typography/Title.js'
import { DateTime } from 'luxon'

interface ClimateSettingScheduleRowProps {
  climateSettingSchedule: UseClimateSettingSchedulesData[number]
  onClick: () => void
}

export function ClimateSettingScheduleRow({
  climateSettingSchedule,
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
            <span className='seam-status-text'>{`Starts ${startDate}`}</span>
            <ClimateSettingStatus climateSetting={climateSettingSchedule} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}
