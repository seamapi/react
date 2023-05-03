import type { LockDevice } from 'seamapi'

import { OnlineStatusDeviceOfflineIcon } from 'lib/icons/OnlineStatusDeviceOffline.js'
import { OnlineStatusOnlineIcon } from 'lib/icons/OnlineStatusOnline.js'

export function OnlineStatus(props: { device: LockDevice }) {
  const { device } = props

  if (device.properties.online) {
    return (
      <>
        <OnlineStatusOnlineIcon />
        Online
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
