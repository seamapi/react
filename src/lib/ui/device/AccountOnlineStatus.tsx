import type { CommonDevice } from 'seamapi'

import { OnlineStatusAccountOfflineIcon } from 'lib/icons/OnlineStatusAccountOffline.js'
import { OnlineStatusOnlineIcon } from 'lib/icons/OnlineStatusOnline.js'

interface AccountOnlineStatusProps {
  device: CommonDevice
}

export function AccountOnlineStatus(
  props: AccountOnlineStatusProps
): JSX.Element {
  const { device } = props
  const isAccountOffline =
    device.errors.filter((error) => error.error_code === 'account_disconnected')
      .length > 0

  return (
    <div className='seam-online-status'>
      <Content isOnline={!isAccountOffline} />
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
      <OnlineStatusAccountOfflineIcon />
      <span className='seam-text-danger'>{t.accountOffline}</span>
    </>
  )
}

const t = {
  online: 'Online',
  accountOffline: 'Account Offline',
}
