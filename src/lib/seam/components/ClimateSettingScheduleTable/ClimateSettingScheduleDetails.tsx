import { DateTime } from 'luxon'
import type { ClimateSettingSchedule } from 'seamapi'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { DotDivider } from 'lib/ui/layout/DotDivider.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'
import { useIsDateInPast } from 'lib/ui/use-is-date-in-past.js'

export function ClimateSettingScheduleDetails(props: {
  climateSettingSchedule: ClimateSettingSchedule
}): JSX.Element {
  const { climateSettingSchedule } = props
  const { device } = useDevice({ device_id: climateSettingSchedule.device_id })

  return (
    <div className='seam-climate-setting-schedule-details'>
      <span className='seam-device-name seam-truncated-text'>
        {device?.properties.name}
      </span>
      <DotDivider />
      <Duration climateSettingSchedule={climateSettingSchedule} />
      <DotDivider />
      <ClimateSettingStatus climateSetting={climateSettingSchedule} />
    </div>
  )
}

function Duration(props: {
  climateSettingSchedule: ClimateSettingSchedule
}): JSX.Element {
  const { climateSettingSchedule } = props

  const hasStarted = useIsDateInPast(climateSettingSchedule.schedule_starts_at)

  if (hasStarted) {
    return (
      <span>
        {t.ends} {formatDate(climateSettingSchedule.schedule_ends_at)}{' '}
      </span>
    )
  }

  return (
    <span>
      {t.starts} {formatDate(climateSettingSchedule.schedule_starts_at)}
    </span>
  )
}

function formatDate(date: string): string {
  return DateTime.fromISO(date).toLocaleString({
    month: 'long',
    day: 'numeric',
  })
}

const t = {
  starts: 'Starts',
  ends: 'Ends',
}
