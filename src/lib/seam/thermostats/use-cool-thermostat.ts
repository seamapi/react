import type {
  SeamActionAttemptFailedError,
  SeamActionAttemptTimeoutError,
  SeamHttpApiError,
  ThermostatsCoolBody,
} from '@seamapi/http/connect'
import type { ActionAttempt, Device } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getCoolingSetPointCelsius,
  getCoolingSetPointFahrenheit,
} from 'lib/seam/thermostats/unit-conversion.js'
import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseCoolThermostatParams = never

export type UseCoolThermostatData = undefined

export type UseCoolThermostatMutationVariables = Pick<
  ThermostatsCoolBody,
  'device_id' | 'cooling_set_point_celsius' | 'cooling_set_point_fahrenheit'
>

type CoolThermostatActionAttempt = Extract<
  ActionAttempt,
  { action_type: 'SET_COOL' }
>

type MutationError =
  | SeamHttpApiError
  | SeamActionAttemptFailedError<CoolThermostatActionAttempt>
  | SeamActionAttemptTimeoutError<CoolThermostatActionAttempt>

export function useCoolThermostat(): UseMutationResult<
  UseCoolThermostatData,
  MutationError,
  UseCoolThermostatMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseCoolThermostatData,
    MutationError,
    UseCoolThermostatMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.cool(variables)
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

const getUpdatedDevice = (
  device: Device,
  variables: UseCoolThermostatMutationVariables
): Device => {
  const { properties } = device
  if (
    'current_climate_setting' in properties &&
    properties.current_climate_setting != null
  ) {
    return {
      ...device,
      properties: {
        ...properties,
        current_climate_setting: {
          ...properties.current_climate_setting,
          hvac_mode_setting: 'cool',
          automatic_heating_enabled: false,
          automatic_cooling_enabled: true,
          heating_set_point_celsius: undefined,
          heating_set_point_fahrenheit: undefined,
          cooling_set_point_celsius: getCoolingSetPointCelsius(
            variables,
            device
          ),
          cooling_set_point_fahrenheit: getCoolingSetPointFahrenheit(
            variables,
            device
          ),
        },
      },
    }
  }
  return device
}
