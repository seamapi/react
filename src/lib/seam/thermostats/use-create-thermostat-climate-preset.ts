import type { ThermostatsCreateClimatePresetBody } from '@seamapi/http/connect'
import { useQueryClient } from '@tanstack/react-query'

import type {
  ThermostatClimatePreset,
  ThermostatDevice,
} from 'lib/seam/thermostats/thermostat-device.js'
import { fahrenheitToCelsius } from 'lib/seam/thermostats/unit-conversion.js'

import {
  useSeamMutation,
  type UseSeamMutationResult,
} from '../use-seam-mutation.js'

export type UseCreateThermostatClimatePresetParams = never
export type UseCreateThermostatClimatePresetData = undefined

export type UseCreateThermostatClimatePresetVariables =
  ThermostatsCreateClimatePresetBody

export function useCreateThermostatClimatePreset(): UseSeamMutationResult<'/thermostats/create_climate_preset'> {
  const queryClient = useQueryClient()

  return useSeamMutation('/thermostats/create_climate_preset', {
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

const getUpdatedDevice = (
  device: ThermostatDevice,
  variables: UseCreateThermostatClimatePresetVariables
): ThermostatDevice => {
  const preset: ThermostatClimatePreset = {
    ...variables,
    cooling_set_point_celsius: fahrenheitToCelsius(
      variables.cooling_set_point_fahrenheit
    ),
    heating_set_point_celsius: fahrenheitToCelsius(
      variables.heating_set_point_fahrenheit
    ),
    display_name: variables.name ?? variables.climate_preset_key,
    can_delete: true,
    can_edit: true,
    can_program: true,
    manual_override_allowed: false,
  }

  return {
    ...device,
    properties: {
      ...device.properties,
      available_climate_presets: [
        preset,
        ...(device.properties.available_climate_presets ?? []),
      ],
    },
  }
}
