import { DateTime } from 'luxon'
import type { AccessCode } from 'seamapi'

import { DotDivider } from 'lib/ui/layout/DotDivider.js'

export function CodeDetails(props: { accessCode: AccessCode }): JSX.Element {
  const { accessCode } = props

  return (
    <div className='seam-code-details'>
      Unit 110
      <DotDivider />
      <Duration accessCode={accessCode} />
      <DotDivider />
      {t.code}: {accessCode.code}
    </div>
  )
}

function Duration(props: { accessCode: AccessCode }): JSX.Element {
  const { accessCode } = props
  if (accessCode.type === 'ongoing') {
    return (
      <span>
        {t.ends}: {t.never}
      </span>
    )
  }

  const hasStarted = new Date(accessCode.starts_at).valueOf() < Date.now()
  if (hasStarted) {
    return (
      <span>
        {t.ends}: {formatDate(accessCode.ends_at)}{' '}
      </span>
    )
  }

  return (
    <span>
      {t.starts}: {formatDate(accessCode.starts_at)}
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
  code: 'Code',
  starts: 'Starts',
  ends: 'Ends',
  never: 'Never',
}
