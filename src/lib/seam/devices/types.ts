import type {
  CommonDeviceProperties,
  Device,
  DeviceType,
  LockDevice,
} from 'seamapi'

export type CommonDevice = Device<CommonDeviceProperties, DeviceType>

export const isLockDevice = (
  device: CommonDevice | LockDevice
): device is LockDevice => {
  if (device.capabilities_supported.includes('access_codes')) return true
  if (device.capabilities_supported.includes('lock')) return true
  if (device.capabilities_supported.includes('unlock')) return true
  return false
}
