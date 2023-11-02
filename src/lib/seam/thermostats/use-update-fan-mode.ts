import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  SeamError,
  ThermostatDevice,
  ThermostatSetFanModeRequest,
  ThermostatsListResponse,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

// UPSTREAM: Missing ThermostatSetFanModeResponse in seamapi.
type UseUpdateFanModeData = Record<string, unknown>
type UseUpdateFanModeMutationParams = ThermostatSetFanModeRequest

export function useUpdateFanMode(): UseMutationResult<
  UseUpdateFanModeData,
  SeamError,
  UseUpdateFanModeMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseUpdateFanModeData,
    SeamError,
    UseUpdateFanModeMutationParams
  >({
    mutationFn: async (mutationParams: UseUpdateFanModeMutationParams) => {
      if (client === null) throw new NullSeamClientError()

      return await client.thermostats.setFanMode(mutationParams)
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<ThermostatDevice | null>(
        ['thermostats', 'get', { device_id: variables.device_id }],
        (thermostat) => {
          if (thermostat == null) {
            return
          }

          return getUpdatedThermostat(thermostat, variables)
        }
      )

      queryClient.setQueryData<ThermostatsListResponse['thermostats']>(
        ['thermostats', 'list', { device_id: variables.device_id }],
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
  variables: UseUpdateFanModeMutationParams
): ThermostatDevice {
  return {
    ...thermostat,
    properties: {
      ...thermostat.properties,
      fan_mode_setting:
        variables.fan_mode_setting ?? thermostat.properties.fan_mode_setting,
    },
  }
}
