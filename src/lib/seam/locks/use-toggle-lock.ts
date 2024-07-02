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

export type UseToggleLockParams = never

export type UseToggleLockData = undefined

export type UseToggleLockMutationVariables = Pick<Device, 'device_id'> & {
  properties: Required<Pick<Device['properties'], 'locked'>>
}

type ToggleLockActionAttempt =
  | Extract<ActionAttempt, { action_type: 'LOCK_DOOR' }>
  | Extract<ActionAttempt, { action_type: 'UNLOCK_DOOR' }>

type MutationError =
  | SeamHttpApiError
  | SeamActionAttemptFailedError<ToggleLockActionAttempt>
  | SeamActionAttemptTimeoutError<ToggleLockActionAttempt>

export function useToggleLock(): UseMutationResult<
  UseToggleLockData,
  MutationError,
  UseToggleLockMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseToggleLockData,
    MutationError,
    UseToggleLockMutationVariables
  >({
    mutationFn: async (variables) => {
      const {
        device_id: deviceId,
        properties: { locked },
      } = variables
      if (client === null) throw new NullSeamClientError()
      if (locked == null) return
      if (locked) await client.locks.unlockDoor({ device_id: deviceId })
      if (!locked) await client.locks.lockDoor({ device_id: deviceId })
    },
    onMutate: (variables) => {
      queryClient.setQueryData<Device[]>(['devices', 'list', {}], (devices) => {
        if (devices == null) {
          return devices
        }

        return devices.map((device) => {
          if (
            device.device_id !== variables.device_id ||
            device.properties.locked == null
          ) {
            return device
          }

          return {
            ...device,
            properties: {
              ...device.properties,
              locked: !variables.properties.locked,
            },
          }
        })
      })

      queryClient.setQueryData<Device>(
        ['devices', 'get', { device_id: variables.device_id }],
        (device) => {
          if (device?.properties.locked == null) return device

          return {
            ...device,
            properties: {
              ...device.properties,
              locked: !variables.properties.locked,
            },
          }
        }
      )
    },
    onError: async (_error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['devices', 'list'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['devices', 'get', { device_id: variables.device_id }],
      })
    },
  })
}
