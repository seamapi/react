import type { HvacModeSetting } from 'seamapi'

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
  minCool,
  maxCool,
  delta,
}: ControlBounds): MinMax => {
  const actualMaxHeat =
    mode === 'heat_cool' ? Math.min(maxHeat - delta, maxCool - delta) : maxHeat

  const actualMinHeat =
    mode === 'heat_cool' ? Math.max(minHeat, minCool) : minHeat

  return { min: actualMinHeat, max: actualMaxHeat }
}

export const getCoolBounds = ({
  mode,
  minHeat,
  maxHeat,
  minCool,
  maxCool,
  delta,
}: ControlBounds): MinMax => {
  const actualMaxCool =
    mode === 'heat_cool' ? Math.min(maxCool, maxHeat) : maxCool

  const actualMinCool =
    mode === 'heat_cool' ? Math.max(minCool + delta, minHeat + delta) : minCool

  return { min: actualMinCool, max: actualMaxCool }
}

export const getTemperatureBounds = (
  controlBounds: ControlBounds
): TemperatureBounds => ({
  heat: getHeatBounds(controlBounds),
  cool: getCoolBounds(controlBounds),
})
