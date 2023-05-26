import type { LockDevice } from 'seamapi'

import { OnlineStatusDeviceOfflineIcon } from 'lib/icons/OnlineStatusDeviceOffline.js'
import { OnlineStatusOnlineIcon } from 'lib/icons/OnlineStatusOnline.js'

interface OnlineStatusProps {
  device: LockDevice
}

export function OnlineStatus(props: OnlineStatusProps): JSX.Element {
  const {
    device: {
      properties: { online },
    },
  } = props

  return (
    <div className='seam-online-status'>
      <Content isOnline={online} />
    </div>
  )
}

function Content(props: { isOnline: boolean }): JSX.Element {
  const { isOnline } = props
  if (isOnline) {
    return (
      <>
        <OnlineStatusOnlineIcon />
        <span className='seam-status-text'>{t.online}</span>
      </>
    )
  }

  return (
    <>
      <OnlineStatusDeviceOfflineIcon />
      <span className='seam-text-danger'>{t.deviceOffline}</span>
    </>
  )
}

const t = {
  online: 'Online',
  deviceOffline: 'Device Offline',
}
