import { ClimateSettingScheduleIcon } from 'lib/icons/ClimateSettingSchedule.js'
import { ClimateSettingScheduleRowDetails } from 'lib/seam/components/ClimateSettingScheduleTable/ClimateSettingScheduleRowDetails.js'
import type { UseClimateSettingSchedulesData } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedules.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { Title } from 'lib/ui/typography/Title.js'

interface ClimateSettingScheduleRowProps {
  climateSettingSchedule: UseClimateSettingSchedulesData[number]
  onClick: () => void
}

export function ClimateSettingScheduleRow({
  climateSettingSchedule,
  onClick,
}: ClimateSettingScheduleRowProps): JSX.Element {
  return (
    <TableRow onClick={onClick}>
      <TableCell className='seam-icon-cell'>
        <div>
          <ClimateSettingScheduleIcon />
        </div>
      </TableCell>
      <TableCell className='seam-name-cell'>
        <Title className='seam-truncated-text'>
          {climateSettingSchedule.name}
        </Title>
        <ClimateSettingScheduleRowDetails
          climateSettingSchedule={climateSettingSchedule}
        />
      </TableCell>
    </TableRow>
  )
}
