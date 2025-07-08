import type {
  SeamActionAttemptFailedError,
  SeamActionAttemptTimeoutError,
  SeamHttpApiError,
  ThermostatsOffBody,
} from '@seamapi/http/connect'
import { NullSeamClientError, useSeamClient } from '@seamapi/react-query'
import type { ActionAttempt, Device } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

export type UseSetThermostatOffParams = never

export type UseSetThermostatOffData = undefined

export type UseSetThermostatOffMutationVariables = ThermostatsOffBody

type SetThermostatOffActionAttempt = Extract<
  ActionAttempt,
  { action_type: 'SET_THERMOSTAT_OFF' }
>

type MutationError =
  | SeamHttpApiError
  | SeamActionAttemptFailedError<SetThermostatOffActionAttempt>
  | SeamActionAttemptTimeoutError<SetThermostatOffActionAttempt>

export function useSetThermostatOff(): UseMutationResult<
  UseSetThermostatOffData,
  MutationError,
  UseSetThermostatOffMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseSetThermostatOffData,
    MutationError,
    UseSetThermostatOffMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.off(variables)
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<Device | null>(
        ['devices', 'get', { device_id: variables.device_id }],
        (device) => {
          if (device == null) {
            return
          }
          return getUpdatedDevice(device)
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
              return getUpdatedDevice(device)
            }

            return device
          })
        }
      )
    },
  })
}

const getUpdatedDevice = (device: Device): Device => {
  const { properties } = device
  if (
    'current_climate_setting' in properties &&
    properties.current_climate_setting != null
  ) {
    return {
      ...device,
      properties: {
        ...properties,
        is_fan_running: false,
        is_cooling: false,
        is_heating: false,
        current_climate_setting: {
          ...properties.current_climate_setting,
          hvac_mode_setting: 'off',
          heating_set_point_celsius: undefined,
          heating_set_point_fahrenheit: undefined,
          cooling_set_point_celsius: undefined,
          cooling_set_point_fahrenheit: undefined,
        },
      },
    }
  }
  return device
}
