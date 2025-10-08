import { useState } from 'react'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { isLockDevice, type LockDevice } from 'lib/seam/locks/is-lock-device.js'
import { useToggleLock } from 'lib/seam/locks/use-toggle-lock.js'
import { Button } from 'lib/ui/Button.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { Snackbar, type SnackbarVariant } from 'lib/ui/Snackbar/Snackbar.js'
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

  if (device.can_program_online_access_codes == null) {
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
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarVariant, setSnackbarVariant] =
    useState<SnackbarVariant>('success')

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

  const toggleLockLabel = device.properties.locked ? t.unlock : t.lock

  return (
    <>
      <Snackbar
        variant={snackbarVariant}
        visible={snackbarVisible}
        onClose={() => {
          setSnackbarVisible(false)
        }}
        message={
          snackbarVariant === 'success'
            ? t.successfullyUpdated
            : t.failedToUpdate
        }
        autoDismiss
      />

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
        {!disableLockUnlock && device.properties.online && (
          <Button
            onClick={() => {
              toggleLock.mutate(device)
            }}
          >
            {toggleLockLabel}
          </Button>
        )}
      </div>
    </>
  )
}

const t = {
  deviceDetails: 'Device details',
  unlock: 'Unlock',
  lock: 'Lock',
  successfullyUpdated: 'Lock status has been successfully updated',
  failedToUpdate: 'Failed to update lock status',
}
