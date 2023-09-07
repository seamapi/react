import { useCallback } from 'react'
import type { HvacModeSetting } from 'seamapi'

import { ThermostatCoolLargeIcon } from 'lib/icons/ThermostatCoolLarge.js'
import { ThermostatHeatLargeIcon } from 'lib/icons/ThermostatHeatLarge.js'
import { TemperatureControl } from 'lib/ui/thermostat/TemperatureControl.js'

interface TemperatureControlGroupProps {
  mode: Exclude<HvacModeSetting, 'off'>
  heatValue: number
  onHeatValueChange: (temperature: number) => void
  coolValue: number
  onCoolValueChange: (temperature: number) => void
  delta: number
  minHeat: number
  maxHeat: number
  minCool: number
  maxCool: number
}

export function TemperatureControlGroup({
  mode,
  heatValue,
  onHeatValueChange,
  coolValue,
  onCoolValueChange,
  delta,
  minHeat,
  maxHeat,
  minCool,
  maxCool,
}: TemperatureControlGroupProps): JSX.Element {
  const showHeat = mode === 'heat' || mode === 'heat_cool'
  const showCool = mode === 'cool' || mode === 'heat_cool'

  const adjustHeat = useCallback(
    (temperature: number) => {
      const actualMaxHeat =
        mode === 'heat_cool'
          ? Math.min(maxHeat - delta, maxCool - delta)
          : maxHeat
      const actualMinHeat =
        mode === 'heat_cool' ? Math.max(minHeat, minCool) : minHeat

      const adjustedHeat = Math.min(
        Math.max(temperature, actualMinHeat),
        actualMaxHeat
      )

      onHeatValueChange(adjustedHeat)

      if (coolValue < adjustedHeat + delta) {
        onCoolValueChange(adjustedHeat + delta)
      }
    },
    [
      mode,
      minHeat,
      maxHeat,
      minCool,
      maxCool,
      delta,
      coolValue,
      onHeatValueChange,
      onCoolValueChange,
    ]
  )

  const adjustCool = useCallback(
    (temperature: number) => {
      const actualMaxCool =
        mode === 'heat_cool' ? Math.min(maxCool, maxHeat) : maxCool
      const actualMinCool =
        mode === 'heat_cool'
          ? Math.max(minCool + delta, minHeat + delta)
          : minCool

      const adjustedCool = Math.min(
        Math.max(temperature, actualMinCool),
        actualMaxCool
      )

      onCoolValueChange(adjustedCool)

      if (heatValue > adjustedCool - delta) {
        onHeatValueChange(adjustedCool - delta)
      }
    },
    [
      mode,
      minCool,
      maxCool,
      minHeat,
      maxHeat,
      delta,
      heatValue,
      onCoolValueChange,
      onHeatValueChange,
    ]
  )

  return (
    <div className='seam-temperature-control-group'>
      {showHeat && (
        <div className='seam-temperature-control-group-block'>
          <ThermostatHeatLargeIcon />
          <TemperatureControl
            variant='heat'
            value={heatValue}
            onChange={adjustHeat}
            min={minHeat}
            max={maxHeat}
          />
        </div>
      )}

      {showCool && (
        <div className='seam-temperature-control-group-block'>
          <ThermostatCoolLargeIcon />
          <TemperatureControl
            variant='cool'
            value={coolValue}
            onChange={adjustCool}
            min={minCool}
            max={maxCool}
          />
        </div>
      )}
    </div>
  )
}
