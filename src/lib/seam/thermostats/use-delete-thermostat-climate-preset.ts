import type {
  SeamHttpApiError,
  ThermostatsDeleteClimatePresetParams,
} from '@seamapi/http/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import type { ThermostatDevice } from 'lib/seam/thermostats/thermostat-device.js'
import { NullSeamClientError, useSeamClient } from '@seamapi/react-query'

export type UseDeleteThermostatClimatePresetParams = never

export type UseDeleteThermostatClimatePresetData = undefined

export type UseDeleteThermostatClimatePresetVariables =
  ThermostatsDeleteClimatePresetParams

export function useDeleteThermostatClimatePreset(): UseMutationResult<
  UseDeleteThermostatClimatePresetData,
  SeamHttpApiError,
  UseDeleteThermostatClimatePresetVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseDeleteThermostatClimatePresetData,
    SeamHttpApiError,
    UseDeleteThermostatClimatePresetVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.deleteClimatePreset(variables)
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<ThermostatDevice | null>(
        ['devices', 'get', { device_id: variables.device_id }],
        (device) => {
          if (device == null) {
            return
          }

          return getUpdatedDevice(device, variables)
        }
      )

      queryClient.setQueryData<ThermostatDevice[]>(
        ['devices', 'list', { device_id: variables.device_id }],
        (devices): ThermostatDevice[] => {
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
  device: ThermostatDevice,
  variables: UseDeleteThermostatClimatePresetVariables
): ThermostatDevice {
  return {
    ...device,
    properties: {
      ...device.properties,
      available_climate_presets:
        device.properties.available_climate_presets.filter((preset) => {
          return preset.climate_preset_key !== variables.climate_preset_key
        }),
    },
  }
}
