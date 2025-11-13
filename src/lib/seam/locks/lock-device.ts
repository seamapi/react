import type { Device } from '@seamapi/types/connect'

export type LockDevice = Omit<Device, 'properties'> & {
  properties: Device['properties'] &
    NonNullable<Required<Pick<Device['properties'], 'locked'>>>
}

export const isLockDevice = (device: Device): device is LockDevice => {
  return (
    device.properties.locked != null ||
    device.can_remotely_lock != null ||
    device.can_remotely_unlock != null ||
    device.can_program_online_access_codes != null ||
    device.can_program_offline_access_codes != null ||
    device.properties.online_access_codes_enabled != null ||
    device.properties.offline_access_codes_enabled != null
  )
}
