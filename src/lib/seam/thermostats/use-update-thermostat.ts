import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  SeamError,
  ThermostatDevice,
  ThermostatsListResponse,
  ThermostatUpdateRequest,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

// UPSTREAM: Missing ThermostatUpdateResponse in seamapi.
export type UseUpdateThermostatData = Record<string, unknown>

export type UseUpdateThermostatMutationVariables = ThermostatUpdateRequest

export function useUpdateThermostat(): UseMutationResult<
  UseUpdateThermostatData,
  SeamError,
  UseUpdateThermostatMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseUpdateThermostatData,
    SeamError,
    UseUpdateThermostatMutationVariables
  >({
    mutationFn: async (variables: UseUpdateThermostatMutationVariables) => {
      if (client === null) throw new NullSeamClientError()

      await client.thermostats.update(variables)
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
  variables: UseUpdateThermostatMutationVariables
): ThermostatDevice {
  return {
    ...thermostat,

    properties: {
      ...thermostat.properties,

      default_climate_setting: {
        ...thermostat.properties.default_climate_setting,
        manual_override_allowed:
          thermostat.properties?.default_climate_setting
            ?.manual_override_allowed != null
            ? thermostat.properties.default_climate_setting
                .manual_override_allowed
            : true,

        ...variables.default_climate_setting,
      },
    },
  }
}
