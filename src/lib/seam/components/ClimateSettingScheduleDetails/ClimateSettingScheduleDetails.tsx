import classNames from 'classnames'
import { DateTime } from 'luxon'
import { useState } from 'react'
import type {
  ClimateSettingSchedule,
  ConnectedAccountError,
  DeviceError,
} from 'seamapi'

import { DeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { useClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { useDeleteClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-delete-climate-setting-schedule.js'
import { Alerts } from 'lib/ui/Alert/Alerts.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { useIsDateInPast } from 'lib/ui/use-is-date-in-past.js'

const disableEditClimateSettingSchedule = true

export interface ClimateSettingScheduleDetailsProps {
  climateSettingScheduleId: string
  disableLockUnlock?: boolean
  onBack?: () => void
  onEdit: () => void
  className?: string
  disableDeleteClimateSettingSchedule?: boolean
}

export function ClimateSettingScheduleDetails({
  climateSettingScheduleId,
  disableLockUnlock = false,
  onBack,
  onEdit,
  className,
  disableDeleteClimateSettingSchedule = false,
}: ClimateSettingScheduleDetailsProps): JSX.Element | null {
  const { climateSettingSchedule } = useClimateSettingSchedule(
    climateSettingScheduleId
  )
  const [selectedDeviceId, selectDevice] = useState<string | null>(null)
  const { mutate: deleteCode, isLoading: isDeleting } =
    useDeleteClimateSettingSchedule()

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
    <div className={classNames('seam-access-code-details', className)}>
      <ContentHeader title='Access code' onBack={onBack} />
      <div className='seam-summary'>
        <div
          className={classNames(
            'seam-top'
            // alerts.length > 0 && 'seam-top-has-alerts'
          )}
        >
          <span className='seam-label'>{t.climateSettingSchedule}</span>
          <h5 className='seam-access-code-name'>{name}</h5>
          <div className='seam-code'>{climateSettingSchedule.code}</div>
          <div className='seam-duration'>
            <Duration climateSettingSchedule={climateSettingSchedule} />
          </div>
        </div>

        {/* <Alerts alerts={alerts} className='seam-alerts-padded' /> */}

        {/* <ClimateSettingScheduleDevice
          deviceId={climateSettingSchedule.device_id}
          disableLockUnlock={disableLockUnlock}
          onSelectDevice={selectDevice}
        /> */}
      </div>
      {(!disableEditClimateSettingSchedule ||
        !disableDeleteClimateSettingSchedule) && (
        <div className='seam-actions'>
          {/* {!disableEditClimateSettingSchedule && (
            <Button size='small' onClick={onEdit} disabled={isDeleting}>
              {t.editCode}
            </Button>
          )} */}
          {/* {!disableDeleteClimateSettingSchedule && (
            <Button
              size='small'
              onClick={() => {
                deleteCode({
                  access_code_id: climateSettingSchedule.access_code_id,
                })
              }}
              disabled={isDeleting}
            >
              {t.deleteCode}
            </Button>
          )} */}
        </div>
      )}
      <div className='seam-details'>
        <div className='seam-row'>
          <div className='seam-heading'>{t.id}:</div>
          <div className='seam-content'>
            {climateSettingSchedule.access_code_id}
          </div>
        </div>
        <div className='seam-row'>
          <div className='seam-heading'>{t.created}:</div>
          <div className='seam-content'>
            {formatDate(climateSettingSchedule.created_at)}
          </div>
        </div>

        <div className='seam-row seam-schedule'>
          <div className='seam-heading'>{t.timing}:</div>
          <div className='seam-content'>
            <ScheduleInfo climateSettingSchedule={climateSettingSchedule} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ScheduleInfo({
  climateSettingSchedule,
}: {
  climateSettingSchedule: ClimateSettingSchedule
}): JSX.Element {
  return (
    <div className='seam-times'>
      <div>
        <div className='seam-label'>{t.start}</div>
        <div className='seam-date'>
          {formatDate(climateSettingSchedule.schedule_starts_at)}
        </div>
        <div className='seam-time'>
          {formatTime(climateSettingSchedule.schedule_starts_at)}
        </div>
      </div>
      <div>
        <div className='seam-label'>{t.end}</div>
        <div className='seam-date'>
          {formatDate(climateSettingSchedule.schedule_ends_at)}
        </div>
        <div className='seam-time'>
          {formatTime(climateSettingSchedule.schedule_ends_at)}
        </div>
      </div>
    </div>
  )
}

function Duration(props: {
  climateSettingSchedule: ClimateSettingSchedule
}): JSX.Element {
  const { climateSettingSchedule } = props

  const hasStarted =
    useIsDateInPast(
      'starts_at' in climateSettingSchedule
        ? climateSettingSchedule?.schedule_starts_at
        : null
    ) ?? false

  if (hasStarted) {
    return (
      <span>
        <span className='seam-label'>Active</span> until{' '}
        {formatDurationDate(climateSettingSchedule.schedule_ends_at)} at{' '}
        {formatTime(climateSettingSchedule.schedule_ends_at)}
      </span>
    )
  }

  return (
    <span>
      Starts {formatDurationDate(climateSettingSchedule.schedule_starts_at)} as{' '}
      {formatTime(climateSettingSchedule.schedule_starts_at)}
    </span>
  )
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

function formatDate(date: string): string {
  return DateTime.fromISO(date).toLocaleString({
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const errorFilter = (error: DeviceError | ConnectedAccountError): boolean => {
  if ('is_access_code_error' in error && !error.is_access_code_error)
    return true

  if (
    error.error_code === 'failed_to_set_on_device' ||
    error.error_code === 'failed_to_remove_on_device'
  ) {
    return true
  }

  return false
}

const t = {
  climateSettingSchedule: 'Climate Setting Schedule',
  fallbackName: 'Code',
  id: 'ID',
  created: 'Created',
  timing: 'Timing',
  ongoing: 'Ongoing',
  start: 'Start',
  end: 'End',
  editCode: 'Edit code',
  deleteCode: 'Delete code',
}
