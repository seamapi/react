import { DateTime } from 'luxon'
import { useState } from 'react'
import type { AccessCode, CommonDeviceProperties, Device } from 'seamapi'

import AccessCodeDevice from 'lib/ui/AccessCodeDetails/AccessCodeDevice.js'
import { DeviceDetails } from 'lib/ui/DeviceDetails/DeviceDetails.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

export interface AccessCodeDetailsProps {
  accessCode: AccessCode
  onBack?: () => void
}

export default function AccessCodeDetails({
  accessCode,
  onBack,
}: AccessCodeDetailsProps) {
  const name = accessCode.name ?? t.fallbackName
  const [selectedDevice, selectDevice] =
    useState<Device<CommonDeviceProperties> | null>(null)

  if (selectedDevice) {
    return (
      <DeviceDetails
        device={selectedDevice}
        onBack={() => {
          selectDevice(null)
        }}
      />
    )
  }

  return (
    <div className='seam-access-code-details'>
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

function ScheduleInfo({ accessCode }: { accessCode: AccessCode }) {
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
  if (accessCode.type === 'ongoing') {
    return (
      <span>
        <span className='seam-label'>Active</span> (ongoing)
      </span>
    )
  }

  const hasStarted = new Date(accessCode.starts_at).valueOf() < Date.now()
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
