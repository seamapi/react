import type { ThermostatsDeleteClimatePresetParams } from '@seamapi/http/connect'
import { useQueryClient } from '@tanstack/react-query'

import type { ThermostatDevice } from 'lib/seam/thermostats/thermostat-device.js'

import {
  useSeamMutation,
  type UseSeamMutationResult,
} from '../use-seam-mutation.js'

export type UseDeleteThermostatClimatePresetParams = never

export type UseDeleteThermostatClimatePresetData = undefined

export type UseDeleteThermostatClimatePresetVariables =
  ThermostatsDeleteClimatePresetParams

export function useDeleteThermostatClimatePreset(): UseSeamMutationResult<'/thermostats/delete_climate_preset'> {
  const queryClient = useQueryClient()

  return useSeamMutation('/thermostats/delete_climate_preset', {
    onSuccess: (_data, variables) => {
      if (variables == null) return

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
