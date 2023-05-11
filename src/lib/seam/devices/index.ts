import type { LockDevice } from 'seamapi'

export * from './use-devices.js'

export const getLockModel = ({ properties }: LockDevice) => {
  return (
    properties?.august_metadata?.model ?? properties?.schlage_metadata?.model
  )
}
