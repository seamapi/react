import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  SeamError,
  ThermostatDevice,
  ThermostatHeatRequest,
  ThermostatsListResponse,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

// UPSTREAM: Missing ThermostatHeatResponse in seamapi.
export type UseHeatThermostatData = Record<string, unknown>

export type UseHeatThermostatMutationVariables = ThermostatHeatRequest

export function useHeatThermostat(): UseMutationResult<
  UseHeatThermostatData,
  SeamError,
  UseHeatThermostatMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseHeatThermostatData,
    SeamError,
    UseHeatThermostatMutationVariables
  >({
    mutationFn: async (variables: UseHeatThermostatMutationVariables) => {
      if (client === null) throw new NullSeamClientError()

      return await client.thermostats.heat(variables)
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<ThermostatDevice | null>(
        ['devices', 'get', { device_id: variables.device_id }],
        (thermostat) => {
          if (thermostat == null) {
            return
          }

          return getUpdatedThermostat(thermostat, variables)
        }
      )

      queryClient.setQueryData<ThermostatsListResponse['thermostats']>(
        ['devices', 'list', { device_id: variables.device_id }],
        (thermostats): ThermostatDevice[] => {
          if (thermostats == null) {
            return []
          }

          return thermostats.map((thermostat) => {
            if (thermostat.device_id === variables.device_id) {
              return getUpdatedThermostat(thermostat, variables)
            }

            return thermostat
          })
        }
      )
    },
  })
}

function getUpdatedThermostat(
  thermostat: ThermostatDevice,
  variables: UseHeatThermostatMutationVariables
): ThermostatDevice {
  return {
    ...thermostat,
    properties: {
      ...thermostat.properties,
      current_climate_setting: {
        ...thermostat.properties.current_climate_setting,
        heating_set_point_fahrenheit:
          variables.heating_set_point_fahrenheit ??
          thermostat.properties.current_climate_setting
            .heating_set_point_fahrenheit,
        heating_set_point_celsius:
          variables.heating_set_point_celsius ??
          thermostat.properties.current_climate_setting
            .heating_set_point_celsius,
      },
    },
  }
}
