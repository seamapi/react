import type { CommonDevice } from 'seamapi'

import { OnlineStatusAccountOfflineIcon } from 'lib/icons/OnlineStatusAccountOffline.js'
import { OnlineStatusOnlineIcon } from 'lib/icons/OnlineStatusOnline.js'

interface OnlineStatusProps {
  device: CommonDevice
}

export function AccountOnlineStatus(props: OnlineStatusProps): JSX.Element {
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
      <OnlineStatusAccountOfflineIcon />
      <span className='seam-text-danger'>{t.accountOffline}</span>
    </>
  )
}

const t = {
  online: 'Online',
  accountOffline: 'Account Offline',
}
