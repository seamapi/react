import type { LockDevice } from 'seamapi'

import { OnlineStatusDeviceOfflineIcon } from 'lib/icons/OnlineStatusDeviceOffline.js'
import { OnlineStatusOnlineIcon } from 'lib/icons/OnlineStatusOnline.js'

export function OnlineStatus(props: { device: LockDevice }): JSX.Element {
  const { device } = props
  return (
    <>
      <span className='seam-label'>{t.status}:</span>{' '}
      <div className='seam-online-status'>
        <Status isOnline={device.properties.online} />
      </div>
    </>
  )
}

function Status(props: { isOnline: boolean }): JSX.Element {
  const { isOnline } = props

  if (isOnline) {
    return (
      <>
        <OnlineStatusOnlineIcon />
        <span className='seam-status-text'>{t.online}</span>
      </>
    )
  }

  // TODO: Check for Account Offline status

  return (
    <>
      <OnlineStatusDeviceOfflineIcon />
      <span className='seam-text-danger'>{t.deviceOffline}</span>
    </>
  )
}

const t = {
  status: 'Status',
  online: 'Online',
  deviceOffline: 'Device Offline',
}
