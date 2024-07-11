import type { Device } from '@seamapi/types/connect'

import { OnlineStatusAccountOfflineIcon } from 'lib/icons/OnlineStatusAccountOffline.js'
import { OnlineStatusDeviceOfflineIcon } from 'lib/icons/OnlineStatusDeviceOffline.js'
import { OnlineStatusOnlineIcon } from 'lib/icons/OnlineStatusOnline.js'

interface OnlineStatusProps {
  device: Device
}

export function OnlineStatus(props: OnlineStatusProps): JSX.Element {
  const { device } = props

  return (
    <div className='seam-online-status'>
      {isDeviceAccountOffline(device) ? (
        <AccountOfflineContent />
      ) : (
        <AccountOnlineContent isOnline={device.properties.online} />
      )}
    </div>
  )
}

function AccountOfflineContent(): JSX.Element {
  return (
    <>
      <OnlineStatusAccountOfflineIcon />
      <span className='seam-text-danger'>{t.accountOffline}</span>
    </>
  )
}

function AccountOnlineContent(props: { isOnline: boolean }): JSX.Element {
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

export const isDeviceAccountOffline = (device: Device): boolean =>
  device.errors.filter((error) => error.error_code === 'account_disconnected')
    .length > 0

const t = {
  online: 'Online',
  accountOffline: 'Account Offline',
  deviceOffline: 'Device Offline',
}
