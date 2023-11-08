import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  SeamError,
  ThermostatCoolRequest,
  ThermostatDevice,
  ThermostatsListResponse,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

// UPSTREAM: Missing ThermostatHeatResponse in seamapi.
type UseUpdateCoolData = Record<string, unknown>
type UseUpdateCoolMutationParams = ThermostatCoolRequest

export function useUpdateCool(): UseMutationResult<
  UseUpdateCoolData,
  SeamError,
  UseUpdateCoolMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<UseUpdateCoolData, SeamError, UseUpdateCoolMutationParams>(
    {
      mutationFn: async (mutationParams: UseUpdateCoolMutationParams) => {
        if (client === null) throw new NullSeamClientError()

        return await client.thermostats.cool(mutationParams)
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
    }
  )
}

function getUpdatedThermostat(
  thermostat: ThermostatDevice,
  variables: UseUpdateCoolMutationParams
): ThermostatDevice {
  return {
    ...thermostat,
    properties: {
      ...thermostat.properties,
      current_climate_setting: {
        ...thermostat.properties.current_climate_setting,
        cooling_set_point_fahrenheit:
          variables.cooling_set_point_fahrenheit ??
          thermostat.properties.current_climate_setting
            .cooling_set_point_fahrenheit,
        cooling_set_point_celsius:
          variables.cooling_set_point_celsius ??
          thermostat.properties.current_climate_setting
            .cooling_set_point_celsius,
      },
    },
  }
}
