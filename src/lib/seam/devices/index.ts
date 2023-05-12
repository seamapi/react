import type { LockDevice } from 'seamapi'

export * from './use-devices.js'

export const getDeviceModel = ({ properties }: LockDevice): string | undefined => {
  return (
    properties?.august_metadata?.model ?? properties?.schlage_metadata?.model
  )
}
