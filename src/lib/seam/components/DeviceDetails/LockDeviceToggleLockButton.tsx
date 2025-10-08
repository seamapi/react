import type { LockDevice } from 'lib/seam/locks/lock-device.js'
import { Button } from 'lib/ui/Button.js'

interface LockDeviceToggleLockButtonProps {
  device: LockDevice
  onToggle: () => void
  disableLockUnlock: boolean
}

export function LockDeviceToggleLockButton({
  device,
  onToggle,
  disableLockUnlock,
}: LockDeviceToggleLockButtonProps): JSX.Element {
  const lockStatus = device.properties.locked ? t.locked : t.unlocked
  const toggleLockLabel = device.properties.locked ? t.unlock : t.lock

  return (
    <div className='seam-content seam-lock-status'>
      <div>
        <span className='seam-label'>{t.lockStatus}</span>
        <span className='seam-value'>{lockStatus}</span>
      </div>
      <div className='seam-right'>
        {!disableLockUnlock &&
          device.capabilities_supported.includes('lock') && (
            <Button size='small' onClick={onToggle}>
              {toggleLockLabel}
            </Button>
          )}
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
}
