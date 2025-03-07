import type { Device } from '@seamapi/types/connect'

export type ThermostatDevice = Omit<Device, 'properties'> & {
  properties: Device['properties'] &
    Required<
      Pick<
        Device['properties'],
        | 'temperature_celsius'
        | 'temperature_fahrenheit'
        | 'is_heating'
        | 'is_cooling'
        | 'is_fan_running'
        | 'available_hvac_mode_settings'
        | 'fan_mode_setting'
        | 'current_climate_setting'
        | 'available_climate_presets'
      >
    >
}

// UPSTREAM: FanModeSetting missing in @seamapi/types.
export type FanModeSetting = ThermostatDevice['properties']['fan_mode_setting']

// UPSTREAM: HvacModeSetting missing in @seamapi/types.
export type HvacModeSetting =
  ThermostatDevice['properties']['available_hvac_mode_settings'][number]

// UPSTREAM: ClimateSetting missing in @seamapi/types.
export interface ClimateSetting {
  hvac_mode_setting?: HvacModeSetting
  cooling_set_point_celsius?: number
  heating_set_point_celsius?: number
  cooling_set_point_fahrenheit?: number
  heating_set_point_fahrenheit?: number
}

export const isThermostatDevice = (
  device: Device
): device is ThermostatDevice => 'is_fan_running' in device.properties

export type ThermostatClimatePreset = ThermostatDevice['properties']['available_climate_presets'][number]
