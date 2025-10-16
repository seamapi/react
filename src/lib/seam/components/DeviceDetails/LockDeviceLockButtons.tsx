import type { LockDevice } from 'lib/seam/locks/is-lock-device.js'
import { useLock } from 'lib/seam/locks/use-lock.js'
import { useToggleLock } from 'lib/seam/locks/use-toggle-lock.js'
import { useUnlock } from 'lib/seam/locks/use-unlock.js'
import { Button } from 'lib/ui/Button.js'
import type { SnackbarVariant } from 'lib/ui/Snackbar/Snackbar.js'

interface LockDeviceLockButtonsProps {
  device: LockDevice
  disableLockUnlock: boolean
  setSnackbarVisible: (visible: boolean) => void
  setSnackbarVariant: (variant: SnackbarVariant) => void
}

export function LockDeviceLockButtons({
  device,
  setSnackbarVariant,
  setSnackbarVisible,
  disableLockUnlock,
}: LockDeviceLockButtonsProps): JSX.Element | null {
  const lockStatus = device.properties.locked ? t.locked : t.unlocked
  const toggleLockLabel = device.properties.locked ? t.unlock : t.lock

  const toggleLock = useToggleLock({
    onSuccess: () => {
      setSnackbarVisible(true)
      setSnackbarVariant('success')
    },
    onError: () => {
      setSnackbarVisible(true)
      setSnackbarVariant('error')
    },
  })

  const lock = useLock({
    onSuccess: () => {
      setSnackbarVisible(true)
      setSnackbarVariant('success')
    },
    onError: () => {
      setSnackbarVisible(true)
      setSnackbarVariant('error')
    },
  })

  const unlock = useUnlock({
    onSuccess: () => {
      setSnackbarVisible(true)
      setSnackbarVariant('success')
    },
    onError: () => {
      setSnackbarVisible(true)
      setSnackbarVariant('error')
    },
  })

  if (disableLockUnlock) {
    return null
  }

  if (
    device.can_remotely_lock === true &&
    device.can_remotely_unlock === true
  ) {
    return (
      <div className='seam-content seam-lock-status'>
        <div>
          <span className='seam-label'>{t.lockStatus}</span>
          <span className='seam-value'>{lockStatus}</span>
        </div>
        <div className='seam-right'>
          <Button
            size='small'
            onClick={() => {
              toggleLock.mutate(device)
            }}
          >
            {toggleLockLabel}
          </Button>
        </div>
      </div>
    )
  }

  if (device.can_remotely_lock === true) {
    return (
      <div className='seam-content seam-lock-status'>
        <div>
          <span className='seam-label'>{t.lockStatus}</span>
          <span className='seam-value'>{lockStatus}</span>
        </div>
        <div className='seam-right'>
          <Button
            size='small'
            onClick={() => {
              lock.mutate(device)
            }}
          >
            {t.lock}
          </Button>
        </div>
      </div>
    )
  }

  if (device.can_remotely_unlock === true) {
    return (
      <div className='seam-content seam-lock-status'>
        <div>
          <span className='seam-label'>{t.lockStatus}</span>
          <span className='seam-value'>{lockStatus}</span>
        </div>
        <div className='seam-right'>
          <Button
            size='small'
            onClick={() => {
              unlock.mutate(device)
            }}
          >
            {t.unlock}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='seam-content seam-lock-status'>
      <div>
        <span className='seam-label'>{t.lockStatus}</span>
        <span className='seam-value'>{t.statusUnknown}</span>
      </div>
      <div className='seam-right'>
        <Button
          size='small'
          onClick={() => {
            lock.mutate(device)
          }}
        >
          {t.lock}
        </Button>
        <Button
          size='small'
          onClick={() => {
            unlock.mutate(device)
          }}
        >
          {t.unlock}
        </Button>
      </div>
    </div>
  )
}

const t = {
  unlock: 'Unlock',
  lock: 'Lock',
  locked: 'Locked',
  unlocked: 'Unlocked',
  lockStatus: 'Lock status',
  statusUnknown: 'Unknown',
}
