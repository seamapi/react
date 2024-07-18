import type { ClimateSettingSchedule } from '@seamapi/types/connect'

import { ClimateSettingScheduleIcon } from 'lib/icons/ClimateSettingSchedule.js'
import { ClimateSettingScheduleRowDetails } from 'lib/seam/components/ClimateSettingScheduleTable/ClimateSettingScheduleRowDetails.js'
import { TableCell } from 'lib/ui/Table/TableCell.js'
import { TableRow } from 'lib/ui/Table/TableRow.js'
import { Title } from 'lib/ui/typography/Title.js'

interface ClimateSettingScheduleRowProps {
  climateSettingSchedule: ClimateSettingSchedule
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
