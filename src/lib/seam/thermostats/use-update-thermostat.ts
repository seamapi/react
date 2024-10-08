import type {
  SeamHttpApiError,
  ThermostatsUpdateClimatePresetBody,
} from '@seamapi/http/connect'
import type { Device } from '@seamapi/types/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import { shake } from 'lib/object.js'
import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseUpdateThermostatParams = never

export type UseUpdateThermostatData = undefined

export type UseUpdateThermostatMutationVariables =
  ThermostatsUpdateClimatePresetBody

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
      await client.thermostats.updateClimatePreset(variables)
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
  variables: UseUpdateThermostatMutationVariables
): Device => {
  const { properties } = device
  console.log(properties.fallback_climate_preset_key)

  const fallback = properties.available_climate_presets?.find(
    (cp) => cp.climate_preset_key === properties.fallback_climate_preset_key
  )
  if (
    'default_climate_setting' in properties &&
    properties.default_climate_setting != null
  ) {
    return {
      ...device,
      properties: {
        ...properties,
        fallback_climate_preset_key: variables,
        default_climate_setting: {
          ...properties.default_climate_setting,
          ...shake(variables.default_climate_setting),
        },
      },
    }
  }
  return device
}
