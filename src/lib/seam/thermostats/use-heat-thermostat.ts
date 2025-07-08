import type {
  SeamActionAttemptFailedError,
  SeamActionAttemptTimeoutError,
  SeamHttpApiError,
  ThermostatsHeatBody,
} from '@seamapi/http/connect'
import { NullSeamClientError, useSeamClient } from '@seamapi/react-query'
import type { ActionAttempt, Device } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getHeatingSetPointCelsius,
  getHeatingSetPointFahrenheit,
} from 'lib/seam/thermostats/unit-conversion.js'

export type UseHeatThermostatParams = never

export type UseHeatThermostatData = undefined

export type UseHeatThermostatMutationVariables = Pick<
  ThermostatsHeatBody,
  'device_id' | 'heating_set_point_celsius' | 'heating_set_point_fahrenheit'
>

type HeatThermostatActionAttempt = Extract<
  ActionAttempt,
  { action_type: 'SET_HEAT' }
>

type MutationError =
  | SeamHttpApiError
  | SeamActionAttemptFailedError<HeatThermostatActionAttempt>
  | SeamActionAttemptTimeoutError<HeatThermostatActionAttempt>

export function useHeatThermostat(): UseMutationResult<
  UseHeatThermostatData,
  MutationError,
  UseHeatThermostatMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseHeatThermostatData,
    MutationError,
    UseHeatThermostatMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.heat(variables)
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
  variables: UseHeatThermostatMutationVariables
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
          hvac_mode_setting: 'heat',
          cooling_set_point_celsius: undefined,
          cooling_set_point_fahrenheit: undefined,
          heating_set_point_celsius: getHeatingSetPointCelsius(
            variables,
            device
          ),
          heating_set_point_fahrenheit: getHeatingSetPointFahrenheit(
            variables,
            device
          ),
        },
      },
    }
  }
  return device
}
