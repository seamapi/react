import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  SeamError,
  ThermostatDevice,
  ThermostatHeatCoolRequest,
  ThermostatsListResponse,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

// UPSTREAM: Missing ThermostatHeatCoolResponse in seamapi.
type UseHeatCoolThermostatData = Record<string, unknown>
type UseHeatCoolThermostatMutationParams = ThermostatHeatCoolRequest

export function useHeatCoolThermostat(): UseMutationResult<
  UseHeatCoolThermostatData,
  SeamError,
  UseHeatCoolThermostatMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseHeatCoolThermostatData,
    SeamError,
    UseHeatCoolThermostatMutationParams
  >({
    mutationFn: async (mutationParams: UseHeatCoolThermostatMutationParams) => {
      if (client === null) throw new NullSeamClientError()

      return await client.thermostats.heatCool(mutationParams)
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
  variables: UseHeatCoolThermostatMutationParams
): ThermostatDevice {
  return {
    ...thermostat,
    properties: {
      ...thermostat.properties,
      current_climate_setting: {
        ...thermostat.properties.current_climate_setting,
        ...variables,
      },
    },
  }
}
