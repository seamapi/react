import type {
  SeamHttpApiError,
  ThermostatsUpdateClimatePresetBody,
} from '@seamapi/http/connect'
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'

import type { ThermostatDevice } from 'lib/seam/thermostats/thermostat-device.js'
import { NullSeamClientError, useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseUpdateThermostatClimatePresetParams = never
export type UseUpdateThermostatClimatePresetData = undefined

export type UseUpdateThermostatClimatePresetVariables =
  ThermostatsUpdateClimatePresetBody

const fhToCelsius = (t?: number): number | undefined =>
  t == null ? undefined : (t - 32) * (5 / 9)

type ClimatePreset =
  ThermostatDevice['properties']['available_climate_presets'][number]

export function useUpdateThermostatClimatePreset(): UseMutationResult<
  UseUpdateThermostatClimatePresetData,
  SeamHttpApiError,
  UseUpdateThermostatClimatePresetVariables
> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  return useMutation<
    UseUpdateThermostatClimatePresetData,
    SeamHttpApiError,
    UseUpdateThermostatClimatePresetVariables
  >({
    mutationFn: async (variables) => {
      if (client === null) throw new NullSeamClientError()
      await client.thermostats.createClimatePreset(variables)
    },
    onSuccess: (_data, variables) => {
      const preset: ClimatePreset = {
        ...variables,
        cooling_set_point_celsius: fhToCelsius(
          variables.cooling_set_point_fahrenheit
        ),
        heating_set_point_celsius: fhToCelsius(
          variables.heating_set_point_fahrenheit
        ),
        display_name: variables.name ?? variables.climate_preset_key,
        can_delete: true,
        can_edit: true,
        manual_override_allowed: true,
      }

      queryClient.setQueryData<ThermostatDevice | null>(
        ['devices', 'get', { device_id: variables.device_id }],
        (device) => {
          if (device == null) {
            return
          }

          return getUpdatedDevice(device, preset)
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
              return getUpdatedDevice(device, preset)
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
  preset: ClimatePreset
): ThermostatDevice {
  if (device == null) {
    return device
  }

  return {
    ...device,
    properties: {
      ...device.properties,
      available_climate_presets: [
        preset,
        ...(device.properties.available_climate_presets ?? [])
      ],
    },
  }
}
