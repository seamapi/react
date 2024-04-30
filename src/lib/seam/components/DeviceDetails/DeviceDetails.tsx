import { isLockDevice, isNoiseSensorDevice, isThermostatDevice } from 'seamapi'

import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { LockDeviceDetails } from 'lib/seam/components/DeviceDetails/LockDeviceDetails.js'
import { NoiseSensorDeviceDetails } from 'lib/seam/components/DeviceDetails/NoiseSensorDeviceDetails.js'
import { ThermostatDeviceDetails } from 'lib/seam/components/DeviceDetails/ThermostatDeviceDetails.js'
import { useDevice } from 'lib/seam/devices/use-device.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'

export interface DeviceDetailsProps extends CommonProps {
  deviceId: string
}

export const NestedDeviceDetails = withRequiredCommonProps(DeviceDetails)

export interface NestedSpecificDeviceDetailsProps
  extends Required<Omit<CommonProps, 'onBack' | 'className'>> {
  onBack: (() => void) | undefined
  className: string | undefined
}

export function DeviceDetails({
  deviceId,
  errorFilter = () => true,
  warningFilter = () => true,
  disableLockUnlock = false,
  disableDeleteAccessCode = false,
  disableResourceIds = false,
  disableConnectedAccountInformation = false,
  disableCreateAccessCode = false,
  disableEditAccessCode = false,
  disableClimateSettingSchedules = false,
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

  const props: NestedSpecificDeviceDetailsProps = {
    errorFilter,
    warningFilter,
    disableLockUnlock,
    disableDeleteAccessCode,
    disableResourceIds,
    disableConnectedAccountInformation,
    disableCreateAccessCode,
    disableEditAccessCode,
    disableClimateSettingSchedules,
    onBack,
    className,
  }

  if (isLockDevice(device)) {
    return <LockDeviceDetails device={device} {...props} />
  }

  if (isThermostatDevice(device)) {
    return <ThermostatDeviceDetails device={device} {...props} />
  }

  if (isNoiseSensorDevice(device)) {
    return <NoiseSensorDeviceDetails device={device} {...props} />
  }

  return null
}
