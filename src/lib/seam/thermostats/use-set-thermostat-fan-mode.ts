import type {
  SeamActionAttemptFailedError,
  SeamActionAttemptTimeoutError,
  SeamHttpApiError,
  ThermostatsSetFanModeBody,
} from '@seamapi/http/connect'
import type { ActionAttempt, Device } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseSetThermostatFanModeParams = never

export type UseSetThermostatFanModeData = undefined

export type UseSetThermostatFanModeMutationVariables = ThermostatsSetFanModeBody

type SetThermostatFanModeActionAttempt = Extract<
  ActionAttempt,
  { action_type: 'SET_FAN_MODE' }
>

type MutationError =
  | SeamHttpApiError
  | SeamActionAttemptFailedError<SetThermostatFanModeActionAttempt>
  | SeamActionAttemptTimeoutError<SetThermostatFanModeActionAttempt>

export function useSetThermostatFanMode(): UseMutationResult<
  UseSetThermostatFanModeData,
  MutationError,
  UseSetThermostatFanModeMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseSetThermostatFanModeData,
    MutationError,
    UseSetThermostatFanModeMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.setFanMode(variables)
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<Device | null>(
        ['devices', 'get', { device_id: variables.device_id }],
        (device) => {
          if (device == null) {
            return
          }
          return getUpdatedDevice(device, variables)
        }
      )

      queryClient.setQueryData<Device[]>(
        ['devices', 'list', { device_id: variables.device_id }],
        (devices): Device[] => {
          if (devices == null) {
            return []
          }

          return devices.map((device) => {
            if (device.device_id === variables.device_id) {
              return getUpdatedDevice(device, variables)
            }

            return device
          })
        }
      )
    },
  })
}

function getUpdatedDevice(
  device: Device,
  variables: UseSetThermostatFanModeMutationVariables
): Device {
  const { properties } = device
  if ('fan_mode_setting' in properties && properties.fan_mode_setting != null) {
    return {
      ...device,
      properties: {
        ...properties,
        fan_mode_setting: variables.fan_mode_setting,
      },
    }
  }
  return device
}
