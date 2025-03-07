import type {
  SeamHttpApiError,
  ThermostatsCreateClimatePresetBody,
} from '@seamapi/http/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import type { ThermostatClimatePreset, ThermostatDevice } from 'lib/seam/thermostats/thermostat-device.js'
import { fahrenheitToCelsius } from 'lib/seam/thermostats/unit-conversion.js'
import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseCreateThermostatClimatePresetParams = never
export type UseCreateThermostatClimatePresetData = undefined

export type UseCreateThermostatClimatePresetVariables =
  ThermostatsCreateClimatePresetBody

export function useCreateThermostatClimatePreset(): UseMutationResult<
  UseCreateThermostatClimatePresetData,
  SeamHttpApiError,
  UseCreateThermostatClimatePresetVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseCreateThermostatClimatePresetData,
    SeamHttpApiError,
    UseCreateThermostatClimatePresetVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.createClimatePreset(variables)
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

const getUpdatedDevice =(
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
