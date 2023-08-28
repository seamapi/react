import { formatDateAndTime } from 'lib/dates.js'
import { ClimateSettingScheduleIcon } from 'lib/icons/ClimateSettingSchedule.js'
import { useClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { ClimateSettingDevice } from 'lib/ui/thermostat/ClimateSettingScheduleDevice.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'

import { DotDivider } from '../layout/DotDivider.js'

interface ClimateSettingScheduleCardProps {
  climateSettingScheduleId: string
}

export function ClimateSettingScheduleCard({
  climateSettingScheduleId,
}: ClimateSettingScheduleCardProps): JSX.Element {
  return (
    <div className='seam-climate-setting-schedule-card'>
      <Content climateSettingScheduleId={climateSettingScheduleId} />
    </div>
  )
}

function Content(props: {
  climateSettingScheduleId: string
}): JSX.Element | null {
  const { climateSettingScheduleId } = props

  const { climateSettingSchedule } = useClimateSettingSchedule(
    climateSettingScheduleId
  )

  if (climateSettingSchedule == null) {
    return null
  }

  const name = climateSettingSchedule.name ?? t.fallbackName

  return (
    <div className='seam-climate-setting-schedule-content'>
      <div className='seam-climate-setting-schedule-summary'>
        <div style={{ padding: '8px' }}>
          <ClimateSettingScheduleIcon />
        </div>
        <div className='seam-climate-setting-schedule-name-block'>
          <h5 className='seam-climate-setting-schedule-heading'>{name}</h5>
          <div className='seam-climate-setting-schedule-subheading'>
            <ClimateSettingStatus climateSetting={climateSettingSchedule} />
            <DotDivider />
            {/* TODO do the 'Ends at' bit here */}
            <span>
              {t.starts}{' '}
              {formatDateAndTime(climateSettingSchedule.schedule_starts_at)}
            </span>
          </div>
        </div>
      </div>
      <ClimateSettingDevice deviceId={climateSettingSchedule.device_id} />
    </div>
  )
}

const t = {
  starts: 'Starts',
  ends: 'Ends',
  fallbackName: 'Climate Setting Schedule',
}
