import { useCallback, useEffect, useMemo } from 'react'
import type { HvacModeSetting } from 'seamapi'

import { ThermostatCoolLargeIcon } from 'lib/icons/ThermostatCoolLarge.js'
import { ThermostatHeatLargeIcon } from 'lib/icons/ThermostatHeatLarge.js'
import {
  getCoolBounds,
  getHeatBounds,
  getTemperatureBounds,
} from 'lib/temperature-bounds.js'
import { TemperatureControl } from 'lib/ui/thermostat/TemperatureControl.js'

export interface TemperatureControlGroupProps {
  mode: Exclude<HvacModeSetting, 'off'>
  heatValue: number
  onHeatValueChange: (temperature: number) => void
  coolValue: number
  onCoolValueChange: (temperature: number) => void
  delta?: number
  minHeat?: number
  maxHeat?: number
  minCool?: number
  maxCool?: number
}

export function TemperatureControlGroup({
  mode,
  heatValue,
  onHeatValueChange,
  coolValue,
  onCoolValueChange,
  delta = 5,
  minHeat = 60,
  maxHeat = 90,
  minCool = 60,
  maxCool = 90,
}: TemperatureControlGroupProps): JSX.Element {
  const showHeat = mode === 'heat' || mode === 'heat_cool'
  const showCool = mode === 'cool' || mode === 'heat_cool'

  const controlBounds = useMemo(
    () => ({
      mode,
      minHeat,
      maxHeat,
      minCool,
      maxCool,
      delta,
    }),
    [mode, minHeat, maxHeat, minCool, maxCool, delta]
  )

  const adjustHeat = useCallback(
    (temperature: number) => {
      const { min, max } = getHeatBounds(controlBounds)
      const adjustedHeat = Math.min(Math.max(temperature, min), max)

      onHeatValueChange(adjustedHeat)

      if (coolValue < adjustedHeat + delta) {
        onCoolValueChange(adjustedHeat + delta)
      }
    },
    [controlBounds, coolValue, delta, onHeatValueChange, onCoolValueChange]
  )

  const adjustCool = useCallback(
    (temperature: number) => {
      const { min, max } = getCoolBounds(controlBounds)
      const adjustedCool = Math.min(Math.max(temperature, min), max)

      onCoolValueChange(adjustedCool)

      if (heatValue > adjustedCool - delta) {
        onHeatValueChange(adjustedCool - delta)
      }
    },
    [controlBounds, heatValue, delta, onCoolValueChange, onHeatValueChange]
  )

  useEffect(() => {
    const {
      heat: { min: minHeat, max: maxHeat },
      cool: { min: minCool, max: maxCool },
    } = getTemperatureBounds(controlBounds)

    if (mode === 'heat_cool') {
      if (heatValue < minHeat) {
        onHeatValueChange(minHeat)
      }

      if (heatValue > maxHeat) {
        onHeatValueChange(maxHeat)
      }

      if (coolValue < minCool) {
        onCoolValueChange(minCool)
      }

      if (coolValue > maxCool) {
        onCoolValueChange(maxCool)
      }
    }

    if (mode === 'heat') {
      if (heatValue < minHeat) {
        onHeatValueChange(minHeat)
      }

      if (heatValue > maxHeat) {
        onHeatValueChange(maxHeat)
      }
    }

    if (mode === 'cool') {
      if (coolValue < minCool) {
        onCoolValueChange(minCool)
      }

      if (coolValue > maxCool) {
        onCoolValueChange(maxCool)
      }
    }
  }, [
    mode,
    heatValue,
    coolValue,
    controlBounds,
    onHeatValueChange,
    onCoolValueChange,
  ])

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
