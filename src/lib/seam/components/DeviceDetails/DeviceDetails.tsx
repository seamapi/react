import { isLockDevice, isThermostatDevice } from 'seamapi'

import { LockDeviceDetails } from 'lib/seam/components/DeviceDetails/LockDeviceDetails.js'
import { ThermostatDeviceDetails } from 'lib/seam/components/DeviceDetails/ThermostatDeviceDetails.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/props.js'
import { useDevice } from 'lib/seam/devices/use-device.js'

export interface DeviceDetailsProps extends CommonProps {
  deviceId: string
}

export const NestedDeviceDetails = withRequiredCommonProps(DeviceDetails)

export function DeviceDetails({
  deviceId,
  disableLockUnlock = false,
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
        device={device}
        disableLockUnlock={disableLockUnlock}
        onBack={onBack}
        className={className}
      />
    )
  }

  if (isThermostatDevice(device)) {
    return (
      <ThermostatDeviceDetails
        device={device}
        onBack={onBack}
        className={className}
      />
    )
  }

  return null
}
