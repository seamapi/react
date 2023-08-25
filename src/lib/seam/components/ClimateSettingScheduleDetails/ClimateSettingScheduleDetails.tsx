import classNames from 'classnames'
import { DateTime } from 'luxon'
import { useState } from 'react'

import { Switch } from '@mui/material'
import { ArrowRightIcon } from 'lib/icons/ArrowRight.js'
import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { ClimateSettingScheduleIcon } from 'lib/icons/ClimateSettingSchedule.js'
import { DeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { useClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { Tooltip } from 'lib/ui/Tooltip/Tooltip.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { DotDivider } from 'lib/ui/layout/DotDivider.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'
import { ClimateSettingDevice } from './ClimateSettingScheduleDevice.js'

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
          <div style={{ padding: '8px' }}>
            <ClimateSettingScheduleIcon />
          </div>

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
        <ClimateSettingDevice
          deviceId={climateSettingSchedule.device_id}
          onSelectDevice={selectDevice}
        />
      </div>
      <span className='seam-default-setting-message'>
        {t.defaultSettingMessagePart1}
        &nbsp;<span className='seam-default-setting'>{t.defaultSetting}</span>
        &nbsp;
        {t.defaultSettingMessagePart2}
      </span>
      <div className='seam-box'>
        <div className='seam-content seam-start-end-toggle'>
          <div>
            <span className='seam-label'>
              {t.startEndTime}
              <Tooltip>{t.startEndTimeTooltip}</Tooltip>
            </span>

            <div>
              <span className='seam-value'>
                {`${formatTimeAndDate(
                  climateSettingSchedule.schedule_starts_at
                )}`}

                <ArrowRightIcon />
                {`${formatTimeAndDate(
                  climateSettingSchedule.schedule_ends_at
                )}`}
              </span>
            </div>
          </div>
          <ChevronRightIcon className='chevron' />
        </div>
        <div className='seam-content seam-climate-setting-toggle'>
          <span className='seam-label'>
            {t.climateSetting} <Tooltip>{t.climateSettingTooltip}</Tooltip>
          </span>
          <div className='seam-right'>
            <ClimateSettingStatus
              climateSetting={climateSettingSchedule}
              iconPlacement='right'
            />
            <ChevronRightIcon className='chevron' />
          </div>
        </div>
        <div className='seam-content seam-allow-manual-override-toggle'>
          <span className='seam-label'>
            {t.allowManualOverride}{' '}
            <Tooltip>{t.allowManualOverrideTooltip}</Tooltip>
          </span>
          <div className='seam-right'>
            <Switch defaultChecked size='small' />
          </div>
        </div>
      </div>
      <div style={{ height: '16px' }} />
      <div className='seam-box'>
        <div className='seam-content seam-creation-date'>
          <span className='seam-label'>{t.creationDate}</span>
          <span className='seam-right seam-value'>
            {formatTimeAndDate(climateSettingSchedule.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
}

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
  startEndTimeTooltip:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consectetur, nisl ut sodales ultricies, elit elit vehicula nunc, eget blandit nunc tortor eu nibh.',

  climateSetting: 'Climate setting',
  climateSettingTooltip:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consectetur, nisl ut sodales ultricies, elit elit vehicula nunc, eget blandit nunc tortor eu nibh.',

  allowManualOverride: 'Allow manual override',
  allowManualOverrideTooltip:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consectetur, nisl ut sodales ultricies, elit elit vehicula nunc, eget blandit nunc tortor eu nibh.',

  creationDate: 'Creation date',
  starts: 'Starts',
  defaultSettingMessagePart1: 'Thermostat will return to its',
  defaultSetting: 'default setting',
  defaultSettingMessagePart2: 'at end time.',
}
