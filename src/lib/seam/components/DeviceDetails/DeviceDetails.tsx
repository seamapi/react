import { isLockDevice, isThermostatDevice } from 'seamapi'

import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { LockDeviceDetails } from 'lib/seam/components/DeviceDetails/LockDeviceDetails.js'
import { ThermostatDeviceDetails } from 'lib/seam/components/DeviceDetails/ThermostatDeviceDetails.js'
import { useDevice } from 'lib/seam/devices/use-device.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'

export interface DeviceDetailsProps extends CommonProps {
  deviceId: string
}

export const NestedDeviceDetails = withRequiredCommonProps(DeviceDetails)

export function DeviceDetails({
  deviceId,
  disableLockUnlock = false,
  disableDeleteAccessCode = false,
  onBack,
  className,
}: DeviceDetailsProps): JSX.Element | null {
  useComponentTelemetry('DeviceDetails')

  const { device } = useDevice({
    device_id: deviceId,
  })

  if (device == null) {
    return null
  }

  const props = {
    disableLockUnlock,
    disableDeleteAccessCode,
    onBack,
    className,
  }

  if (isLockDevice(device)) {
    return <LockDeviceDetails device={device} {...props} />
  }

  if (isThermostatDevice(device)) {
    return <ThermostatDeviceDetails device={device} {...props} />
  }

  return null
}
