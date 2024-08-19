import type {
  HvacModeSetting,
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
