import type {
  SeamActionAttemptFailedError,
  SeamActionAttemptTimeoutError,
  SeamHttpApiError,
} from '@seamapi/http/connect'
import { NullSeamClientError, useSeamClient } from '@seamapi/react-query'
import type { ActionAttempt, Device } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

export type UseUnlockData = undefined

export type UseUnlockMutationVariables = Pick<Device, 'device_id'> & {
  properties: Required<Pick<Device['properties'], 'locked'>>
}

type UnlockActionAttempt = Extract<
  ActionAttempt,
  { action_type: 'UNLOCK_DOOR' }
>

type MutationError =
  | SeamHttpApiError
  | SeamActionAttemptFailedError<UnlockActionAttempt>
  | SeamActionAttemptTimeoutError<UnlockActionAttempt>

interface UseUnlockParams {
  onError?: () => void
  onSuccess?: () => void
}

export function useUnlock(
  params: UseUnlockParams = {}
): UseMutationResult<UseUnlockData, MutationError, UseUnlockMutationVariables> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<UseUnlockData, MutationError, UseUnlockMutationVariables>({
    mutationFn: async (variables) => {
      const {
        device_id: deviceId,
        properties: { locked },
      } = variables
      if (client === null) throw new NullSeamClientError()
      if (locked == null) return
      await client.locks.unlockDoor({ device_id: deviceId })
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
      params.onError?.()

      await queryClient.invalidateQueries({
        queryKey: ['devices', 'list'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['devices', 'get', { device_id: variables.device_id }],
      })
    },
    onSuccess() {
      params.onSuccess?.()
    },
  })
}
