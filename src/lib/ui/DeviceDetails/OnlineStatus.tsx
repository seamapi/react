import type { LockDevice } from 'seamapi'

import { OnlineStatusDeviceOfflineIcon } from 'lib/icons/OnlineStatusDeviceOffline.js'
import { OnlineStatusOnlineIcon } from 'lib/icons/OnlineStatusOnline.js'

export function OnlineStatus(props: { device: LockDevice }) {
  const { device } = props
  return (
    <>
      <span className='seam--label'>Status:</span>{' '}
      <div className='seam--online-status'>
        <Status isOnline={device.properties.online} />
      </div>
    </>
  )
}

function Status(props: { isOnline: boolean }) {
  const { isOnline } = props

  if (isOnline) {
    return (
      <>
        <OnlineStatusOnlineIcon />
        <span className='seam--status-text'>Online</span>
      </>
    )
  }

  // TODO: Check for Account Offline status

  return (
    <>
      <OnlineStatusDeviceOfflineIcon />
      <span className='seam--text-danger'>Device Offline</span>
    </>
  )
}
