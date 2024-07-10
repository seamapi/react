import type {
  SeamHttpApiError,
  ThermostatsUpdateBody,
} from '@seamapi/http/connect'
import type { Device } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { shake } from 'radash'

import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseUpdateThermostatParams = never

export type UseUpdateThermostatData = undefined

export type UseUpdateThermostatMutationVariables = ThermostatsUpdateBody

export function useUpdateThermostat(): UseMutationResult<
  UseUpdateThermostatData,
  SeamHttpApiError,
  UseUpdateThermostatMutationVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseUpdateThermostatData,
    SeamHttpApiError,
    UseUpdateThermostatMutationVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.update(variables)
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

function getUpdatedDevice(
  device: Device,
  variables: UseUpdateThermostatMutationVariables
): Device {
  const { properties } = device
  if (
    'default_climate_setting' in properties &&
    properties.default_climate_setting != null
  ) {
    return {
      ...device,
      properties: {
        ...properties,
        default_climate_setting: {
          ...properties.default_climate_setting,
          ...shake(variables.default_climate_setting),
        },
      },
    }
  }
  return device
}
