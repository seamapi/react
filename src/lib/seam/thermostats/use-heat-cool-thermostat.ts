import type {
  SeamActionAttemptFailedError,
  SeamActionAttemptTimeoutError,
  SeamHttpApiError,
  ThermostatsHeatCoolBody,
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
  getHeatingSetPointCelsius,
  getHeatingSetPointFahrenheit,
} from 'lib/seam/thermostats/unit-conversion.js'
import { NullSeamClientError, useSeamClient } from '@seamapi/react-query'

export type UseHeatCoolThermostatParams = never

export type UseHeatCoolThermostatData = undefined

export type UseHeatCoolThermostatMutationVariables = Pick<
  ThermostatsHeatCoolBody,
  | 'device_id'
  | 'heating_set_point_celsius'
  | 'heating_set_point_fahrenheit'
  | 'cooling_set_point_celsius'
  | 'cooling_set_point_fahrenheit'
>

type HeatCoolThermostatActionAttempt = Extract<
  ActionAttempt,
  { action_type: 'SET_HEAT_COOL' }
>

type MutationError =
  | SeamHttpApiError
  | SeamActionAttemptFailedError<HeatCoolThermostatActionAttempt>
  | SeamActionAttemptTimeoutError<HeatCoolThermostatActionAttempt>

export function useHeatCoolThermostat(): UseMutationResult<
  UseHeatCoolThermostatData,
  MutationError,
  UseHeatCoolThermostatMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseHeatCoolThermostatData,
    MutationError,
    UseHeatCoolThermostatMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.heatCool(variables)
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
  variables: UseHeatCoolThermostatMutationVariables
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
          hvac_mode_setting: 'heat_cool',
          heating_set_point_celsius: getHeatingSetPointCelsius(
            variables,
            device
          ),
          heating_set_point_fahrenheit: getHeatingSetPointFahrenheit(
            variables,
            device
          ),
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
