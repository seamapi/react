import { LockDeviceDetails } from 'lib/seam/components/DeviceDetails/LockDeviceDetails.js'
import { isLockDevice } from 'lib/seam/devices/types.js'
import { useDevice } from 'lib/seam/devices/use-device.js'

export interface DeviceDetailsProps {
  deviceId: string
  onBack?: () => void
  className?: string
}

export function DeviceDetails({
  deviceId,
  onBack,
  className,
}: DeviceDetailsProps): JSX.Element | null {
  const { device } = useDevice({
    device_id: deviceId,
  })

  if (device == null) {
    return null
  }

  if (isLockDevice(device)) {
    return (
      <LockDeviceDetails
        className={className}
        device={device}
        onBack={onBack}
      />
    )
  }

  return null
}
