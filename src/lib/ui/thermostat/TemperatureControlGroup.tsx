import { useCallback, useEffect } from 'react'
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

  const getHeatBounds = useCallback(() => {
    const actualMaxHeat =
      mode === 'heat_cool'
        ? Math.min(maxHeat - delta, maxCool - delta)
        : maxHeat

    const actualMinHeat =
      mode === 'heat_cool' ? Math.max(minHeat, minCool) : minHeat

    return { min: actualMinHeat, max: actualMaxHeat }
  }, [mode, minHeat, maxHeat, minCool, maxCool, delta])

  const getCoolBounds = useCallback(() => {
    const actualMaxCool =
      mode === 'heat_cool' ? Math.min(maxCool, maxHeat) : maxCool

    const actualMinCool =
      mode === 'heat_cool'
        ? Math.max(minCool + delta, minHeat + delta)
        : minCool

    return { min: actualMinCool, max: actualMaxCool }
  }, [mode, minCool, maxCool, minHeat, maxHeat, delta])

  const adjustHeat = useCallback(
    (temperature: number) => {
      const { min, max } = getHeatBounds()
      const adjustedHeat = Math.min(Math.max(temperature, min), max)

      onHeatValueChange(adjustedHeat)

      if (coolValue < adjustedHeat + delta) {
        onCoolValueChange(adjustedHeat + delta)
      }
    },
    [getHeatBounds, coolValue, delta, onHeatValueChange, onCoolValueChange]
  )

  const adjustCool = useCallback(
    (temperature: number) => {
      const { min, max } = getCoolBounds()
      const adjustedCool = Math.min(Math.max(temperature, min), max)

      onCoolValueChange(adjustedCool)

      if (heatValue > adjustedCool - delta) {
        onHeatValueChange(adjustedCool - delta)
      }
    },
    [getCoolBounds, heatValue, delta, onCoolValueChange, onHeatValueChange]
  )

  useEffect(() => {
    if (mode === 'heat_cool') {
      const { min: minHeat, max: maxHeat } = getHeatBounds()
      const { min: minCool, max: maxCool } = getCoolBounds()

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
      const { min: minHeat, max: maxHeat } = getHeatBounds()

      if (heatValue < minHeat) {
        onHeatValueChange(minHeat)
      }

      if (heatValue > maxHeat) {
        onHeatValueChange(maxHeat)
      }
    }

    if (mode === 'cool') {
      const { min: minCool, max: maxCool } = getCoolBounds()

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
    getHeatBounds,
    getCoolBounds,
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
