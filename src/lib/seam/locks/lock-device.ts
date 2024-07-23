import type { Device } from '@seamapi/types/connect'

export type LockDevice = Omit<Device, 'properties'> & {
  properties: Device['properties'] &
    NonNullable<Required<Pick<Device['properties'], 'locked'>>>
}

export const isLockDevice = (device: Device): device is LockDevice =>
  'locked' in device.properties
