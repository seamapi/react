import type { CommonDeviceProperties, Device, LockDevice } from 'seamapi'

export const isLockDevice = (
  device: Device<CommonDeviceProperties, string> | LockDevice
): device is LockDevice => 'locked' in device.properties
