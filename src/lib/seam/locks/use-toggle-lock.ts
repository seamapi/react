import type {
  SeamActionAttemptFailedError,
  SeamActionAttemptTimeoutError,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import type { ActionAttempt, Device } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

type ToggleLockActionAttempt =
  | Extract<ActionAttempt, { action_type: 'LOCK_DOOR' }>
  | Extract<ActionAttempt, { action_type: 'UNLOCK_DOOR' }>

type MutationError =
  | SeamHttpApiError
  | SeamActionAttemptFailedError<ToggleLockActionAttempt>
  | SeamActionAttemptTimeoutError<ToggleLockActionAttempt>

export function useToggleLock({
  device_id: deviceId,
  properties: { locked },
}: Device): UseMutationResult<void, MutationError, void> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<undefined, MutationError>({
    mutationFn: async () => {
      if (client === null) throw new NullSeamClientError()
      if (locked == null) return
      if (locked) await client.locks.unlockDoor({ device_id: deviceId })
      if (!locked) await client.locks.lockDoor({ device_id: deviceId })
    },
    onMutate: () => {
      queryClient.setQueryData<Device[]>(['devices', 'list', {}], (devices) => {
        if (devices == null) {
          return
        }

        return devices.map((device) => {
          if (
            device.device_id !== deviceId ||
            device.properties.locked == null
          ) {
            return device
          }

          return {
            ...device,
            properties: {
              ...device.properties,
              locked: !device.properties.locked,
            },
          }
        })
      })

      queryClient.setQueryData<Device>(
        ['devices', 'get', { device_id: deviceId }],
        (device) => {
          if (device?.properties.locked == null) return

          return {
            ...device,
            properties: {
              ...device.properties,
              locked: !device.properties.locked,
            },
          }
        }
      )
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['devices', 'list'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['devices', 'get', { device_id: deviceId }],
      })
    },
  })
}
