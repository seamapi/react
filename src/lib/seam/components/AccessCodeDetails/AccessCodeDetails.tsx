import classNames from 'classnames'
import { DateTime } from 'luxon'
import { useState } from 'react'
import type { AccessCode } from 'seamapi'

import { useAccessCode } from 'lib/seam/access-codes/use-access-code.js'
import { AccessCodeDevice } from 'lib/seam/components/AccessCodeDetails/AccessCodeDevice.js'
import { DeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { Alerts } from 'lib/ui/Alert/Alerts.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { useIsDateInPast } from 'lib/ui/use-is-date-in-past.js'

export interface AccessCodeDetailsProps {
  accessCodeId: string
  onBack?: () => void
  className?: string
}

export function AccessCodeDetails({
  accessCodeId,
  onBack,
  className,
}: AccessCodeDetailsProps): JSX.Element | null {
  const { accessCode } = useAccessCode(accessCodeId)
  const [selectedDeviceId, selectDevice] = useState<string | null>(null)

  if (accessCode == null) {
    return null
  }

  const name = accessCode.name ?? t.fallbackName

  if (selectedDeviceId != null) {
    return (
      <DeviceDetails
        className={className}
        deviceId={selectedDeviceId}
        onBack={() => {
          selectDevice(null)
        }}
      />
    )
  }

  const filterCodeErrors = () => {
    return (
      accessCode?.errors?.filter((error) => {
        if (error.is_access_code_error) {
          if (
            error.error_code === 'failed_to_set_on_device' ||
            error.error_code === 'failed_to_remove_on_device'
          ) {
            return true
          }

          return false
        }

        return true
      }) ?? []
    )
  }

  const alerts = [
    ...filterCodeErrors().map((error) => ({
      variant: 'error' as const,
      message: error.message,
    })),
    ...(accessCode?.warnings?.map((warning) => ({
      variant: 'warning' as const,
      message: warning.message,
    })) ?? []),
  ]

  return (
    <div className={classNames('seam-access-code-details', className)}>
      <ContentHeader title='Access code' onBack={onBack} />
      <div className='seam-summary'>
        <div className='seam-top'>
          <span className='seam-label'>{t.accessCode}</span>
          <h5 className='seam-access-code-name'>{name}</h5>
          <div className='seam-code'>{accessCode.code}</div>
          <div className='seam-duration'>
            <Duration accessCode={accessCode} />
          </div>
        </div>

        <Alerts alerts={alerts} className='seam-alerts-padded' />

        <AccessCodeDevice
          deviceId={accessCode.device_id}
          onSelectDevice={selectDevice}
        />
      </div>
      <div className='seam-details'>
        <div className='seam-row'>
          <div className='seam-heading'>{t.id}:</div>
          <div className='seam-content'>{accessCode.access_code_id}</div>
        </div>
        <div className='seam-row'>
          <div className='seam-heading'>{t.created}:</div>
          <div className='seam-content'>
            {formatDate(accessCode.created_at)}
          </div>
        </div>

        <div className='seam-row seam-schedule'>
          <div className='seam-heading'>{t.timing}:</div>
          <div className='seam-content'>
            <ScheduleInfo accessCode={accessCode} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ScheduleInfo({ accessCode }: { accessCode: AccessCode }): JSX.Element {
  if (accessCode.type === 'ongoing') {
    return <span>{t.ongoing}</span>
  }
  return (
    <div className='seam-times'>
      <div>
        <div className='seam-label'>{t.start}</div>
        <div className='seam-date'>{formatDate(accessCode.starts_at)}</div>
        <div className='seam-time'>{formatTime(accessCode.starts_at)}</div>
      </div>
      <div>
        <div className='seam-label'>{t.end}</div>
        <div className='seam-date'>{formatDate(accessCode.ends_at)}</div>
        <div className='seam-time'>{formatTime(accessCode.ends_at)}</div>
      </div>
    </div>
  )
}

function Duration(props: { accessCode: AccessCode }): JSX.Element {
  const { accessCode } = props

  const hasStarted =
    useIsDateInPast('starts_at' in accessCode ? accessCode?.starts_at : null) ??
    false

  if (accessCode.type === 'ongoing') {
    return (
      <span>
        <span className='seam-label'>Active</span> (ongoing)
      </span>
    )
  }

  if (hasStarted) {
    return (
      <span>
        <span className='seam-label'>Active</span> until{' '}
        {formatDurationDate(accessCode.ends_at)} at{' '}
        {formatTime(accessCode.ends_at)}
      </span>
    )
  }

  return (
    <span>
      Starts {formatDurationDate(accessCode.starts_at)} as{' '}
      {formatTime(accessCode.starts_at)}
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

const t = {
  accessCode: 'Access code',
  fallbackName: 'Code',
  id: 'ID',
  created: 'Created',
  timing: 'Timing',
  ongoing: 'Ongoing',
  start: 'Start',
  end: 'End',
}
