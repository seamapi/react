import type { CommonDevice } from 'seamapi'

import { OnlineStatusAccountOfflineIcon } from 'lib/icons/OnlineStatusAccountOffline.js'
import { OnlineStatusDeviceOfflineIcon } from 'lib/icons/OnlineStatusDeviceOffline.js'
import { OnlineStatusOnlineIcon } from 'lib/icons/OnlineStatusOnline.js'

interface DeviceOnlineStatusProps {
  device: CommonDevice
}

export function DeviceOnlineStatus(
  props: DeviceOnlineStatusProps
): JSX.Element {
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
      <Content isOnline={device.properties.online} />
    </div>
  )
}

function AccountOfflineContent() {
  return (
    <div className='seam-online-status'>
      <OnlineStatusAccountOfflineIcon />
      <span className='seam-text-danger'>{t.accountOffline}</span>
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
  accountOffline: 'Account Offline',
  deviceOffline: 'Device Offline',
}
