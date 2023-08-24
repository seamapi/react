import classNames from 'classnames'
import { DateTime } from 'luxon'
import { useState } from 'react'

import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { ClimateSettingScheduleIcon } from 'lib/icons/ClimateSettingSchedule.js'
import { DeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { useClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { DotDivider } from 'lib/ui/layout/DotDivider.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'

const disableEditClimateSettingSchedule = true

export interface ClimateSettingScheduleDetailsProps {
  climateSettingScheduleId: string
  disableLockUnlock?: boolean
  onBack?: () => void
  onEdit: () => void
  className?: string
  // disableDeleteClimateSettingSchedule?: boolean
}

export function ClimateSettingScheduleDetails({
  climateSettingScheduleId,
  disableLockUnlock = false,
  onBack,
  onEdit,
  className, // disableDeleteClimateSettingSchedule = false,
}: ClimateSettingScheduleDetailsProps): JSX.Element | null {
  const { climateSettingSchedule } = useClimateSettingSchedule(
    climateSettingScheduleId
  )
  const [selectedDeviceId, selectDevice] = useState<string | null>(null)
  // const { mutate: deleteCode, isLoading: isDeleting } =
  //   useDeleteClimateSettingSchedule()

  if (climateSettingSchedule == null) {
    return null
  }

  const name = climateSettingSchedule.name ?? t.fallbackName

  if (selectedDeviceId != null) {
    return (
      <DeviceDetails
        className={className}
        deviceId={selectedDeviceId}
        onBack={() => {
          selectDevice(null)
        }}
        disableLockUnlock={disableLockUnlock}
      />
    )
  }

  // TODO: warnings

  // const alerts = [
  //   ...climateSettingSchedule.errors.filter(errorFilter).map((error) => ({
  //     variant: 'error' as const,
  //     message: error.message,
  //   })),
  //   ...climateSettingSchedule.warnings.map((warning) => ({
  //     variant: 'warning' as const,
  //     message: warning.message,
  //   })),
  // ]

  return (
    <div
      className={classNames('seam-climate-setting-schedule-details', className)}
    >
      <ContentHeader title='Climate setting schedule' onBack={onBack} />
      <div className='seam-summary'>
        <div className={classNames('seam-top')}>
          <ClimateSettingScheduleIcon />
          <div className='seam-climate-setting-schedule-name-block'>
            <h5 className='seam-climate-setting-schedule-name'>{name}</h5>
            <div className='seam-climate-setting-schedule-subheading'>
              <ClimateSettingStatus climateSetting={climateSettingSchedule} />
              <DotDivider />
              <span>
                {t.starts}{' '}
                {formatTimeAndDate(climateSettingSchedule.schedule_starts_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='seam-box'>
        <div className='seam-content seam-start-end-toggle'>
          <div>
            <span className='seam-label'>{t.startEndTime}</span>
            <span className='seam-value'>{`${formatTimeAndDate(
              climateSettingSchedule.schedule_starts_at
            )} -> ${formatTimeAndDate(
              climateSettingSchedule.schedule_ends_at
            )}`}</span>
          </div>
          <ChevronRightIcon className='chevron' />
        </div>
        <div className='seam-content seam-climate-setting-toggle'>
          <span className='seam-label'>{t.climateSetting}</span>
          <div className='seam-right'>
            <ClimateSettingStatus
              climateSetting={climateSettingSchedule}
              iconPlacement='right'
            />
            <ChevronRightIcon className='chevron' />
          </div>
        </div>
        <div className='seam-content seam-allow-manual-override-toggle'>
          <span className='seam-label'>{t.allowManualOverride}</span>
          <p>Radio</p>
        </div>
      </div>
      <div style={{ height: '16px' }} />
      <div className='seam-box'>
        <div className='seam-content seam-creation-date'>
          <span className='seam-label'>{t.creationDate}</span>
          <span className='seam-value'>
            {formatTimeAndDate(climateSettingSchedule.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
}

// function ScheduleInfo({
//   climateSettingSchedule,
// }: {
//   climateSettingSchedule: ClimateSettingSchedule
// }): JSX.Element {
//   return (
//     <div className='seam-times'>
//       <div>
//         <div className='seam-label'>{t.start}</div>
//         <div className='seam-date'>
//           {formatDate(climateSettingSchedule.schedule_starts_at)}
//         </div>
//         <div className='seam-time'>
//           {formatTime(climateSettingSchedule.schedule_starts_at)}
//         </div>
//       </div>
//       <div>
//         <div className='seam-label'>{t.end}</div>
//         <div className='seam-date'>
//           {formatDate(climateSettingSchedule.schedule_ends_at)}
//         </div>
//         <div className='seam-time'>
//           {formatTime(climateSettingSchedule.schedule_ends_at)}
//         </div>
//       </div>
//     </div>
//   )
// }

// function Duration(props: {
//   climateSettingSchedule: ClimateSettingSchedule
// }): JSX.Element {
//   const { climateSettingSchedule } = props

//   const hasStarted =
//     useIsDateInPast(
//       'starts_at' in climateSettingSchedule
//         ? climateSettingSchedule?.schedule_starts_at
//         : null
//     ) ?? false

//   if (hasStarted) {
//     return (
//       <span>
//         <span className='seam-label'>Active</span> until{' '}
//         {formatDurationDate(climateSettingSchedule.schedule_ends_at)} at{' '}
//         {formatTime(climateSettingSchedule.schedule_ends_at)}
//       </span>
//     )
//   }

//   return (
//     <span>
//       Starts {formatDurationDate(climateSettingSchedule.schedule_starts_at)} as{' '}
//       {formatTime(climateSettingSchedule.schedule_starts_at)}
//     </span>
//   )
// }

function formatTimeAndDate(date: string): string {
  return `${formatDurationDate(date)} at ${formatTime(date)}`
}

function formatDurationDate(date: string): string {
  return DateTime.fromISO(date).toLocaleString({
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(date: string): string {
  return DateTime.fromISO(date).toLocaleString({
    hour: 'numeric',
    minute: '2-digit',
  })
}
// const errorFilter = (error: DeviceError | ConnectedAccountError): boolean => {
//   if ('is_access_code_error' in error && !error.is_access_code_error)
//     return true

//   if (
//     error.error_code === 'failed_to_set_on_device' ||
//     error.error_code === 'failed_to_remove_on_device'
//   ) {
//     return true
//   }

//   return false
// }

const t = {
  climateSettingSchedule: 'Climate Setting Schedule',
  fallbackName: 'Climate Setting Schedule',
  id: 'ID',
  startEndTime: 'Start/End Time',
  climateSetting: 'Climate setting',
  allowManualOverride: 'Allow manual override',
  creationDate: 'Creation date',
  starts: 'Starts',
}
