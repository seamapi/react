import type { AccessCode } from '@seamapi/types/connect'
import { DateTime } from 'luxon'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { DotDivider } from 'lib/ui/layout/DotDivider.js'
import { useIsDateInPast } from 'lib/ui/use-is-date-in-past.js'

export function CodeDetails(props: { accessCode: AccessCode }): JSX.Element {
  const { accessCode } = props
  const { device } = useDevice({ device_id: accessCode.device_id })

  return (
    <div className='seam-details'>
      <span className='seam-device-name seam-truncated-text'>
        {device?.properties.name}
      </span>
      <DotDivider />
      <Duration accessCode={accessCode} />
      <DotDivider />
      <span className='seam-invisible seam-md-block'>{t.code}: </span>
      {accessCode.code}
    </div>
  )
}

function Duration(props: { accessCode: AccessCode }): JSX.Element | null {
  const { accessCode } = props

  const hasStarted =
    useIsDateInPast('starts_at' in accessCode ? accessCode?.starts_at : null) ??
    false

  if (accessCode.type === 'ongoing') {
    return (
      <span>
        {t.ends}: {t.never}
      </span>
    )
  }

  if (hasStarted && accessCode.ends_at != null) {
    return (
      <span>
        {t.ends}: {formatDate(accessCode.ends_at)}{' '}
      </span>
    )
  }

  if (hasStarted && accessCode.starts_at != null) {
    return (
      <span>
        {t.starts}: {formatDate(accessCode.starts_at)}
      </span>
    )
  }

  return null
}

const formatDate = (date: string): string =>
  DateTime.fromISO(date).toLocaleString({
    month: 'long',
    day: 'numeric',
  })

const t = {
  code: 'Code',
  starts: 'Starts',
  ends: 'Ends',
  never: 'Never',
}
