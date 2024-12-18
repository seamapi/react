import type { CommonDevice, LockDevice } from 'seamapi'

export const isLockDevice = (device: CommonDevice): device is LockDevice => {
  const d = device as any
  return (
    (d.properties.online_access_codes_enabled as boolean) ||
    (d.properties.offline_access_codes_enabled as boolean) ||
    'can_remotely_lock' in d ||
    'can_remotely_unlock' in d ||
    'can_program_online_access_code' in d ||
    'can_program_offline_access_code' in d
  )
}
