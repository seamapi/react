import type { LockDevice } from 'seamapi'

import { LockLockedIcon } from 'lib/icons/LockLocked.js'
import { LockUnlockedIcon } from 'lib/icons/LockUnlocked.js'

export interface LockStatusProps {
  device: LockDevice
}

export function LockStatus(props: LockStatusProps): JSX.Element {
  const {
    device: {
      properties: { locked },
    },
  } = props

  return (
    <div className='seam-lock-status'>
      <Content isLocked={locked} />
    </div>
  )
}

function Content(props: { isLocked: boolean }): JSX.Element {
  const { isLocked } = props
  if (isLocked) {
    return (
      <>
        <LockLockedIcon className='seam-lock-icon' />
        <span className='seam-status-text'>{t.locked}</span>
      </>
    )
  }

  return (
    <>
      <LockUnlockedIcon className='seam-lock-icon' />
      <span className='seam-status-text'>{t.unlocked}</span>
    </>
  )
}

const t = {
  locked: 'Locked',
  unlocked: 'Unlocked',
}
