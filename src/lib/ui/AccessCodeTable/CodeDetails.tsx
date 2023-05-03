import dayjs from 'dayjs'
import type { AccessCode } from 'seamapi'

import { DotDivider } from 'lib/ui/layout/DotDivider.js'

export function CodeDetails(props: { accessCode: AccessCode }) {
  const { accessCode } = props

  return (
    <div className='seam--access-code-details'>
      Unit 110
      <DotDivider />
      <Duration accessCode={accessCode} />
      <DotDivider />
      Code: {accessCode.code}
    </div>
  )
}

function Duration(props: { accessCode: AccessCode }) {
  const { accessCode } = props
  if (accessCode.type === 'ongoing') {
    return <span>Ends: Never</span>
  }

  const hasStarted = new Date(accessCode.starts_at).valueOf() < Date.now()
  if (hasStarted) {
    return <span>Ends: {formatDate(accessCode.ends_at)} </span>
  }

  // is in future
  return <span>Starts: {formatDate(accessCode.starts_at)}</span>
}

function formatDate(date: string) {
  return dayjs(date).format('MMM D')
}
