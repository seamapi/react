import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { LockDeviceDetails } from 'lib/seam/components/DeviceDetails/LockDeviceDetails.js'
import { NoiseSensorDeviceDetails } from 'lib/seam/components/DeviceDetails/NoiseSensorDeviceDetails.js'
import { ThermostatDeviceDetails } from 'lib/seam/components/DeviceDetails/ThermostatDeviceDetails.js'
import { useDevice } from 'lib/seam/devices/use-device.js'
import { isLockDevice } from 'lib/seam/locks/lock-device.js'
import { isNoiseSensorDevice } from 'lib/seam/noise-sensors/noise-sensor-device.js'
import { isThermostatDevice } from 'lib/seam/thermostats/thermostat-device.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'

export interface DeviceDetailsProps extends CommonProps {
  deviceId: string
}

export const NestedDeviceDetails = withRequiredCommonProps(DeviceDetails)

export interface NestedSpecificDeviceDetailsProps
  extends Required<Omit<CommonProps, 'onBack' | 'className'>> {
  onBack: (() => void) | undefined
  className: string | undefined
  onEditName?: (newName: string) => void
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
    onBack,
    className,
  }

  if (isLockDevice(device)) {
    return <LockDeviceDetails device={device} onEditName={props.onEditName} {...props} />
  }

  if (isThermostatDevice(device)) {
    return <ThermostatDeviceDetails device={device} onEditName={props.onEditName} {...props} />
  }

  if (isNoiseSensorDevice(device)) {
    return <NoiseSensorDeviceDetails device={device} onEditName={props.onEditName} {...props} />
  }

  return null
}
