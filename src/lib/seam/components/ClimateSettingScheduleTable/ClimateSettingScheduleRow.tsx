import classNames from 'classnames'

import type {
  UseClimateSettingSchedulesData,
  UseClimateSettingSchedulesParams,
} from 'lib/seam/ClimateSettingSchedules/use-ClimateSettingSchedules.js'
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
  const isClimateSettingScheduleOffline =
    !climateSettingSchedule.properties.online
  const isDisconnected =
    isClimateSettingScheduleAccountOffline(climateSettingSchedule) ||
    isClimateSettingScheduleOffline
  const isConnected = !isDisconnected

  return (
    <TableRow onClick={onClick}>
      <TableCell
        className={classNames('seam-image-cell', {
          'seam-offline-fade': isDisconnected,
        })}
      >
        {/* <ClimateSettingScheduleImage
          ClimateSettingSchedule={climateSettingSchedule}
        /> */}
      </TableCell>
      <TableCell className='seam-body-cell'>
        <Title
          className={classNames('seam-truncated-text', {
            'seam-offline-fade': isDisconnected,
          })}
        >
          {climateSettingSchedule.properties.name}
        </Title>
        <div className='seam-bottom'>
          <span
            className={classNames('seam-climatesettingschedule-model', {
              'seam-offline-fade': isDisconnected,
            })}
          >
            {climateSettingSchedule.properties.model.display_name}
          </span>
          <div className='seam-climatesettingschedule-statuses'>
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
