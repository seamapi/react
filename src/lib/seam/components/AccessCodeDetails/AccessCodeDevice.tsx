import { isLockDevice, type LockDevice } from 'seamapi'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { useToggleLock } from 'lib/seam/locks/use-toggle-lock.js'
import { Button } from 'lib/ui/Button.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { TextButton } from 'lib/ui/TextButton.js'

export function AccessCodeDevice({
  deviceId,
  disableLockUnlock,
  onSelectDevice,
}: {
  deviceId: string
  disableLockUnlock: boolean
  onSelectDevice: (deviceId: string) => void
}): JSX.Element | null {
  const { isPending, device } = useDevice({
    device_id: deviceId,
  })

  if (isPending) {
    return null
  }

  if (device == null) {
    return null
  }

  if (!isLockDevice(device)) {
    return null
  }

  return (
    <Content
      device={device}
      disableLockUnlock={disableLockUnlock}
      onSelectDevice={onSelectDevice}
    />
  )
}

function Content(props: {
  device: LockDevice
  disableLockUnlock: boolean
  onSelectDevice: (deviceId: string) => void
}): JSX.Element {
  const { device, disableLockUnlock, onSelectDevice } = props
  const toggleLock = useToggleLock(device)

  const toggleLockLabel = device.properties.locked ? t.unlock : t.lock

  return (
    <div className='seam-access-code-device'>
      <div className='seam-device-image'>
        <DeviceImage device={device} />
      </div>
      <div className='seam-body'>
        <div>{device.properties.name}</div>
        <TextButton
          onClick={() => {
            onSelectDevice(device.device_id)
          }}
        >
          {t.deviceDetails}
        </TextButton>
      </div>
      {!disableLockUnlock && (
        <Button
          onClick={() => {
            toggleLock.mutate()
          }}
        >
          {toggleLockLabel}
        </Button>
      )}
    </div>
  )
}

const t = {
  deviceDetails: 'Device details',
  unlock: 'Unlock',
  lock: 'Lock',
}
