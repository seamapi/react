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
export type UseUpdateFanModeData = Record<string, unknown>

export type UseUpdateFanModeMutationVariables = ThermostatSetFanModeRequest

export function useUpdateFanMode(): UseMutationResult<
  UseUpdateFanModeData,
  SeamError,
  UseUpdateFanModeMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseUpdateFanModeData,
    SeamError,
    UseUpdateFanModeMutationVariables
  >({
    mutationFn: async (variables: UseUpdateFanModeMutationVariables) => {
      if (client === null) throw new NullSeamClientError()

      return await client.thermostats.setFanMode(variables)
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<ThermostatDevice | null>(
        ['devices', 'get', { device_id: variables.device_id }],
        (thermostat) => {
          if (thermostat == null) {
            return
          }

          return getUpdatedDevice(thermostat, variables)
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
              return getUpdatedDevice(thermostat, variables)
            }

            return thermostat
          })
        }
      )
    },
  })
}

function getUpdatedDevice(
  thermostat: ThermostatDevice,
  variables: UseUpdateFanModeMutationVariables
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
