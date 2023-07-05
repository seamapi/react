import type { CommonDevice } from 'seamapi'

import { OnlineStatusAccountOfflineIcon } from 'lib/icons/OnlineStatusAccountOffline.js'
import { OnlineStatusDeviceOfflineIcon } from 'lib/icons/OnlineStatusDeviceOffline.js'
import { OnlineStatusOnlineIcon } from 'lib/icons/OnlineStatusOnline.js'

interface OnlineStatusProps {
  device: CommonDevice
}

export function OnlineStatus(props: OnlineStatusProps): JSX.Element {
  const { device } = props

  const isAccountOffline =
    device.errors.filter((error) => error.error_code === 'account_disconnected')
      .length > 0

  if (isAccountOffline) {
    return <AccountOfflineContent />
  }

  return (
    <div className='seam-online-status'>
      {isAccountOffline && <OnlineStatusAccountOfflineIcon />}
      <DeviceOnlineContent isOnline={device.properties.online} />
    </div>
  )
}

function AccountOfflineContent(): JSX.Element {
  return (
    <div className='seam-online-status'>
      <OnlineStatusAccountOfflineIcon />
      <span className='seam-text-danger'>{t.accountOffline}</span>
    </div>
  )
}

function DeviceOnlineContent(props: { isOnline: boolean }): JSX.Element {
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
  accountOffline: 'Account Offline',
  deviceOffline: 'Device Offline',
}
