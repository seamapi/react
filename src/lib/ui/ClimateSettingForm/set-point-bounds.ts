import type { ThermostatDeviceProperties } from 'seamapi'

import type { TemperatureControlGroupProps } from 'lib/ui/thermostat/TemperatureControlGroup.js'

export type SetPointBounds = Partial<
  Pick<
    TemperatureControlGroupProps,
    'minCool' | 'maxCool' | 'minHeat' | 'maxHeat' | 'delta'
  >
>

export const getSetPointBounds = (
  properties: ThermostatDeviceProperties
): SetPointBounds => {
  let setPointBounds: SetPointBounds = {}

  if (properties.is_cooling_available) {
    setPointBounds = {
      minCool: properties.min_cooling_set_point_fahrenheit,
      maxCool: properties.max_cooling_set_point_fahrenheit,
    }
  }

  if (properties.is_heating_available) {
    setPointBounds = {
      ...setPointBounds,
      minHeat: properties.min_heating_set_point_fahrenheit,
      maxHeat: properties.max_heating_set_point_fahrenheit,
    }
  }

  if (properties.is_cooling_available && properties.is_heating_available) {
    setPointBounds = {
      ...setPointBounds,
      delta: properties.min_heating_cooling_delta_fahrenheit,
    }
  }
  return setPointBounds
}
