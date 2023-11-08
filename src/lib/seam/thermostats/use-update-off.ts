import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  SeamError,
  ThermostatDevice,
  ThermostatOffRequest,
  ThermostatsListResponse,
} from 'seamapi'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

// UPSTREAM: Missing ThermostatOffResponse in seamapi.
type UseSetOffData = Record<string, unknown>
type UseSetOffMutationParams = ThermostatOffRequest

export function useSetOff(): UseMutationResult<
  UseSetOffData,
  SeamError,
  UseSetOffMutationParams
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<UseSetOffData, SeamError, UseSetOffMutationParams>({
    mutationFn: async (mutationParams: UseSetOffMutationParams) => {
      if (client === null) throw new NullSeamClientError()

      return await client.thermostats.off(mutationParams)
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<ThermostatDevice | null>(
        ['devices', 'get', { device_id: variables.device_id }],
        (thermostat) => {
          if (thermostat == null) {
            return
          }

          return getUpdatedThermostat(thermostat)
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
              return getUpdatedThermostat(thermostat)
            }

            return thermostat
          })
        }
      )
    },
  })
}

function getUpdatedThermostat(thermostat: ThermostatDevice): ThermostatDevice {
  return {
    ...thermostat,
    properties: {
      ...thermostat.properties,
      is_fan_running: false,
    },
  }
}
