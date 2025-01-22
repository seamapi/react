import type { Device } from '@seamapi/types/connect'

export type LockDevice = Omit<Device, 'properties'> & {
  properties: Device['properties'] &
    NonNullable<Required<Pick<Device['properties'], 'locked'>>>
}

export const isLockDevice = (device: Device): device is LockDevice => {
  return (
    'locked' in device.properties ||
    'can_remotely_lock' in device ||
    'can_remotely_unlock' in device ||
    'can_program_online_access_code' in device ||
    'can_program_offline_access_code' in device ||
    device.properties.online_access_codes_enabled === true ||
    device.properties.offline_access_codes_enabled === true
  )
}
