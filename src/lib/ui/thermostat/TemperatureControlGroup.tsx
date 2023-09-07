import { useCallback, useEffect, useState } from 'react'
import type { HvacModeSetting } from 'seamapi'

import { ThermostatCoolLargeIcon } from 'lib/icons/ThermostatCoolLarge.js'
import { ThermostatHeatLargeIcon } from 'lib/icons/ThermostatHeatLarge.js'
import { TemperatureControl } from 'lib/ui/thermostat/TemperatureControl.js'

interface TemperatureControlGroupProps {
  mode: Exclude<HvacModeSetting, 'off'>
  heatValue: number
  onHeatValueChange: (t: number) => void
  coolValue: number
  onCoolValueChange: (t: number) => void
  delta: number
  minHeat: number
  maxHeat: number
  minCool: number
  maxCool: number
}

export function TemperatureControlGroup({
  mode,
  // heatValue,
  // onHeatValueChange,
  // coolValue,
  // onCoolValueChange,
  delta,
  minHeat,
  maxHeat,
  minCool,
  maxCool,
}: TemperatureControlGroupProps): JSX.Element {
  const [heatValue, setHeatValue] = useState(75)
  const [coolValue, setCoolValue] = useState(80)

  const showHeat = mode === 'heat' || mode === 'heat_cool'
  const showCool = mode === 'cool' || mode === 'heat_cool'

  const hMax = Math.min(maxHeat - delta, maxCool - delta)
  const hMin = Math.max(minHeat, minCool)

  const cMax = Math.min(maxCool, maxHeat)
  const cMin = Math.max(minCool + delta, minHeat + delta)

  const updateHeat = useCallback(
    (tfunc: (t: number) => number): void => {
      if (mode === 'heat_cool') {
        setHeatValue((t) => Math.min(Math.max(tfunc(t), hMin), hMax))
      } else {
        setHeatValue((t) => Math.min(Math.max(tfunc(t), minHeat), maxHeat))
      }
    },
    [mode, hMax, hMin, minHeat, maxHeat]
  )

  const updateCool = useCallback(
    (tfunc: (t: number) => number): void => {
      if (mode === 'heat_cool') {
        setCoolValue((t) => Math.min(Math.max(tfunc(t), cMin), cMax))
      } else {
        setCoolValue((t) => Math.min(Math.max(tfunc(t), minCool), maxCool))
      }
    },
    [mode, cMax, cMin, minCool, maxCool]
  )

  useEffect(() => {
    updateHeat((currentHeat) => {
      if (coolValue < currentHeat + delta) return coolValue - delta
      return currentHeat
    })
  }, [coolValue, delta, updateHeat])

  useEffect(() => {
    updateCool((currentCool) => {
      if (heatValue > currentCool - delta) return heatValue + delta
      return currentCool
    })
  }, [heatValue, delta, updateCool])

  return (
    <div className='seam-temperature-control-group'>
      {showHeat && (
        <div className='seam-temperature-control-group-block'>
          <ThermostatHeatLargeIcon />
          <TemperatureControl
            variant='heat'
            value={heatValue}
            onChange={(t) => {
              updateHeat((_) => t)
            }}
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
            onChange={(t) => {
              updateCool((_) => t)
            }}
            min={minCool}
            max={maxCool}
          />
        </div>
      )}
    </div>
  )
}
