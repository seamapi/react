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

export type ClimateSettingScheduleTableProps = Props &
  UseClimateSettingSchedulesParams

interface Props {
  onBack?: () => void
}

interface ClimateSettingScheduleRowProps {
  climateSettingSchedule: UseClimateSettingSchedulesData[number]
  onClick: () => void
}

export function ClimateSettingScheduleRow({
  climateSettingSchedule,
  onClick,
}: ClimateSettingScheduleRowProps): JSX.Element | null {
  return (
    <TableRow onClick={onClick}>
      <TableCell>
        <ClimateSettingScheduleIcon />
      </TableCell>
      <TableCell className='seam-body-cell'>
        <Title>{climateSettingSchedule.name}</Title>
        <div className='seam-bottom'>
          {/* <span
          >
            {climateSettingSchedule.properties.model.display_name}
          </span> */}
          <div className='seam-device-statuses'>
            {/* TODO stats go here */}
            {/* <OnlineStatus ClimateSettingSchedule={ClimateSettingSchedule} />
            {isConnected && (
              <BatteryStatus ClimateSettingSchedule={ClimateSettingSchedule} />
            )}
            {isConnected && (
              <LockStatus ClimateSettingSchedule={ClimateSettingSchedule} />
            )} */}
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}
