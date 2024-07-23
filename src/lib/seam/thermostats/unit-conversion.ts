import type { Device } from '@seamapi/types/connect'

export const celsiusToFahrenheit = (t: number): number => (t * 9) / 5 + 32

export const fahrenheitToCelsius = (t: number): number => (t - 32) * (5 / 9)

export const getCoolingSetPointCelsius = (
  variables: {
    cooling_set_point_celsius?: number
    cooling_set_point_fahrenheit?: number
  },
  device: Device
): number | undefined => {
  if (variables.cooling_set_point_celsius != null) {
    return variables.cooling_set_point_celsius
  }

  if (variables.cooling_set_point_fahrenheit != null) {
    return fahrenheitToCelsius(variables.cooling_set_point_fahrenheit)
  }

  return (
    device.properties.current_climate_setting?.cooling_set_point_celsius ??
    undefined
  )
}

export const getCoolingSetPointFahrenheit = (
  variables: {
    cooling_set_point_celsius?: number
    cooling_set_point_fahrenheit?: number
  },
  device: Device
): number | undefined => {
  if (variables.cooling_set_point_fahrenheit != null) {
    return variables.cooling_set_point_fahrenheit
  }

  if (variables.cooling_set_point_celsius != null) {
    return celsiusToFahrenheit(variables.cooling_set_point_celsius)
  }

  return (
    device.properties.current_climate_setting?.cooling_set_point_fahrenheit ??
    undefined
  )
}

export const getHeatingSetPointCelsius = (
  variables: {
    heating_set_point_celsius?: number
    heating_set_point_fahrenheit?: number
  },
  device: Device
): number | undefined => {
  if (variables.heating_set_point_celsius != null) {
    return variables.heating_set_point_celsius
  }

  if (variables.heating_set_point_fahrenheit != null) {
    return fahrenheitToCelsius(variables.heating_set_point_fahrenheit)
  }

  return (
    device.properties.current_climate_setting?.heating_set_point_celsius ??
    undefined
  )
}

export const getHeatingSetPointFahrenheit = (
  variables: {
    heating_set_point_celsius?: number
    heating_set_point_fahrenheit?: number
  },
  device: Device
): number | undefined => {
  if (variables.heating_set_point_fahrenheit != null) {
    return variables.heating_set_point_fahrenheit
  }

  if (variables.heating_set_point_celsius != null) {
    return celsiusToFahrenheit(variables.heating_set_point_celsius)
  }

  return (
    device.properties.current_climate_setting?.heating_set_point_fahrenheit ??
    undefined
  )
}
