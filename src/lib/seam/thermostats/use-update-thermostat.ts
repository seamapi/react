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
type UseUpdateThermostatData = Record<string, unknown>
type UseUpdateThermostatMutationParams = ThermostatUpdateRequest

export function useUpdateThermostat(): UseMutationResult<
  UseUpdateThermostatData,
  SeamError,
  UseUpdateThermostatMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseUpdateThermostatData,
    SeamError,
    UseUpdateThermostatMutationParams
  >({
    mutationFn: async (mutationParams: UseUpdateThermostatMutationParams) => {
      if (client === null) throw new NullSeamClientError()

      await client.thermostats.update(mutationParams);
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
  variables: UseUpdateThermostatMutationParams
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
