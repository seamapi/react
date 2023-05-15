import type { LockDevice } from 'seamapi'

import { isLockDevice } from 'lib/seam/devices/types.js'
import { useDevice } from 'lib/seam/devices/use-device.js'
import { useToggleLock } from 'lib/seam/devices/use-toggle-lock.js'
import { Button } from 'lib/ui/Button.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { getDeviceModel } from 'lib/ui/DeviceDetails/DeviceModel.js'
import { TextButton } from 'lib/ui/TextButton.js'

export function AccessCodeDevice({
  deviceId,
  onSelectDevice,
}: {
  deviceId: string
  onSelectDevice: (deviceId: string) => void
}): JSX.Element | null {
  const { isLoading, device } = useDevice({ device_id: deviceId })

  if (isLoading || device == null || !isLockDevice(device)) {
    return null
  }

  return <LockDeviceDetails device={device} onSelectDevice={onSelectDevice} />
}

function LockDeviceDetails(props: {
  device: LockDevice
  onSelectDevice: (deviceId: string) => void
}) {
  const { device, onSelectDevice } = props
  const toggleLock = useToggleLock(device)
  const model = getDeviceModel(device)

  const toggleLockLabel = device.properties.locked ? t.unlock : t.lock

  return (
    <div className='seam-access-code-device'>
      <div className='seam-device-image'>
        <DeviceImage device={device} />
      </div>
      <div className='seam-body'>
        <div className='seam-model'>{model}</div>
        <TextButton
          onClick={() => {
            onSelectDevice(device.device_id)
          }}
        >
          {t.deviceDetails}
        </TextButton>
      </div>
      <Button
        onClick={() => {
          toggleLock.mutate()
        }}
      >
        {toggleLockLabel}
      </Button>
    </div>
  )
}

const t = {
  deviceDetails: 'Device details',
  unlock: 'Unlock',
  lock: 'Lock',
}
