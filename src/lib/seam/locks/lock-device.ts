import type { CommonDevice, LockDevice } from 'seamapi'

export const isLockDevice = (device: CommonDevice): device is LockDevice =>
  'locked' in device.properties
