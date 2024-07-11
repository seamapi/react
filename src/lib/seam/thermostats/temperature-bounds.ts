import type {
  HvacModeSetting,
  ThermostatDevice,
} from 'lib/seam/thermostats/thermostat-device.js'

export interface ControlBounds {
  mode: Exclude<HvacModeSetting, 'off'>
  minHeat: number
  maxHeat: number
  minCool: number
  maxCool: number
  delta: number
}

interface MinMax {
  min: number
  max: number
}

interface TemperatureBounds {
  heat: MinMax
  cool: MinMax
}

export const getHeatBounds = ({
  mode,
  minHeat,
  maxHeat,
  maxCool,
  delta,
}: Omit<ControlBounds, 'minCool'>): MinMax => {
  const actualMaxHeat =
    mode === 'heat_cool' ? Math.min(maxHeat - delta, maxCool - delta) : maxHeat

  return { min: minHeat, max: actualMaxHeat }
}

export const getCoolBounds = ({
  mode,
  minHeat,
  minCool,
  maxCool,
  delta,
}: Omit<ControlBounds, 'maxHeat'>): MinMax => {
  const actualMinCool =
    mode === 'heat_cool' ? Math.max(minCool + delta, minHeat + delta) : minCool

  return { min: actualMinCool, max: maxCool }
}

export const getTemperatureBounds = (
  controlBounds: ControlBounds
): TemperatureBounds => ({
  heat: getHeatBounds(controlBounds),
  cool: getCoolBounds(controlBounds),
})

export const getSupportedThermostatModes = (
  device: ThermostatDevice
): HvacModeSetting[] => {
  const allModes: HvacModeSetting[] = ['heat', 'cool', 'heat_cool', 'off']

  return allModes.filter((mode) => {
    switch (mode) {
      case 'cool':
        return device.properties.is_cooling_available ?? false
      case 'heat':
        return device.properties.is_heating_available ?? false
      case 'heat_cool':
        return (
          (device.properties.is_heating_available ?? false) &&
          (device.properties.is_cooling_available ?? false)
        )
      default:
        return true
    }
  })
}
