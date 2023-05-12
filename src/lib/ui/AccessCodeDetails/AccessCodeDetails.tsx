import { DateTime } from 'luxon'
import type { AccessCode } from 'seamapi'

import AccessCodeDevice from 'lib/ui/AccessCodeDetails/AccessCodeDevice.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

export interface AccessCodeDetailsProps {
  accessCode: AccessCode
}

export default function AccessCodeDetails({
  accessCode,
}: AccessCodeDetailsProps) {
  const name = accessCode.name ?? t.fallbackName

  return (
    <div className='seam-access-code-details'>
      <ContentHeader title='Access code' />
      <div className='seam-summary'>
        <div className='seam-top'>
          <span className='seam-label'>{t.accessCode}</span>
          <h5 className='seam-access-code-name'>{name}</h5>
          <div className='seam-code'>{accessCode.code}</div>
          <div className='seam-duration'>
            <Duration accessCode={accessCode} />
          </div>
        </div>
        <AccessCodeDevice deviceId={accessCode.device_id} />
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
        {formatDurationTime(accessCode.ends_at)}
      </span>
    )
  }

  return (
    <span>
      Starts {formatDurationDate(accessCode.starts_at)} as{' '}
      {formatDurationTime(accessCode.starts_at)}
    </span>
  )
}

function formatDurationDate(date: string): string {
  return DateTime.fromISO(date).toLocaleString({
    month: 'short',
    day: 'numeric',
  })
}

function formatDurationTime(date: string): string {
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
}
