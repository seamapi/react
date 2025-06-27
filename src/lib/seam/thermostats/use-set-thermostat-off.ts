import type { ThermostatsOffParameters } from '@seamapi/http/connect'
import type { Device } from '@seamapi/types/connect'
import { useQueryClient } from '@tanstack/react-query'

import {
  useSeamMutation,
  type UseSeamMutationResult,
} from '../use-seam-mutation.js'

export type UseSetThermostatOffParams = never

export type UseSetThermostatOffData = undefined

export type UseSetThermostatOffMutationVariables = ThermostatsOffParameters

export function useSetThermostatOff(): UseSeamMutationResult<'/thermostats/off'> {
  const queryClient = useQueryClient()

  return useSeamMutation('/thermostats/off', {
    onSuccess: (_data, variables) => {
      if (variables == null) return

      queryClient.setQueryData<Device | null>(
        ['devices', 'get', { device_id: variables.device_id }],
        (device) => {
          if (device == null) {
            return
          }
          return getUpdatedDevice(device)
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
              return getUpdatedDevice(device)
            }

            return device
          })
        }
      )
    },
  })
}

const getUpdatedDevice = (device: Device): Device => {
  const { properties } = device
  if (
    'current_climate_setting' in properties &&
    properties.current_climate_setting != null
  ) {
    return {
      ...device,
      properties: {
        ...properties,
        is_fan_running: false,
        is_cooling: false,
        is_heating: false,
        current_climate_setting: {
          ...properties.current_climate_setting,
          hvac_mode_setting: 'off',
          heating_set_point_celsius: undefined,
          heating_set_point_fahrenheit: undefined,
          cooling_set_point_celsius: undefined,
          cooling_set_point_fahrenheit: undefined,
        },
      },
    }
  }
  return device
}
