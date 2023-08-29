import type { ClimateSettingSchedule } from 'seamapi'

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
      <div className='seam-climate-setting-schedule-summary-container'>
        <div className='seam-climate-setting-schedule-icon-block'>
          <ClimateSettingScheduleIcon />
        </div>
        <div className='seam-climate-setting-schedule-summary'>
          <h5 className='seam-climate-setting-schedule-heading'>{name}</h5>
          <div className='seam-climate-setting-schedule-subheading'>
            <ClimateSettingStatus climateSetting={climateSettingSchedule} />
            <DotDivider />
            <ClimateSettingScheduleTiming
              climateSettingSchedule={climateSettingSchedule}
            />
          </div>
        </div>
      </div>
      <ClimateSettingDevice deviceId={climateSettingSchedule.device_id} />
    </div>
  )
}

function ClimateSettingScheduleTiming(props: {
  climateSettingSchedule: ClimateSettingSchedule
}): JSX.Element | null {
  const { climateSettingSchedule } = props

  const startTime = new Date(
    climateSettingSchedule.schedule_starts_at
  ).getTime()

  const endTime = new Date(climateSettingSchedule.schedule_ends_at).getTime()

  if (Date.now() < startTime)
    return (
      <span>
        {`${t.starts} ${formatDateAndTime(
          climateSettingSchedule.schedule_starts_at
        )}`}
      </span>
    )

  if (startTime <= Date.now() && Date.now() <= endTime)
    return (
      <span>
        {`${t.ends} ${formatDateAndTime(
          climateSettingSchedule.schedule_starts_at
        )}`}
      </span>
    )

  return <span>{t.expired}</span>
}

const t = {
  starts: 'Starts',
  ends: 'Ends',
  expired: 'Expired',
  fallbackName: 'Climate Setting Schedule',
}
