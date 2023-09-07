import { useEffect } from 'react'

import { ThermostatCoolLargeIcon } from 'lib/icons/ThermostatCoolLarge.js'
import { ThermostatHeatLargeIcon } from 'lib/icons/ThermostatHeatLarge.js'
import { TemperatureControl } from 'lib/ui/thermostat/TemperatureControl.js'

interface TemperatureControlGroupProps {
  mode: 'heat' | 'cool' | 'heat_cool'
  heatValue: number
  onHeatValueChange: (t: number) => void
  coolValue: number
  onCoolValueChange: (t: number) => void
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
  minHeat = 70,
  maxHeat = 100,
  minCool = 50,
  maxCool = 90,
}: TemperatureControlGroupProps): JSX.Element {
  const showHeat = mode === 'heat' || mode === 'heat_cool'
  const showCool = mode === 'cool' || mode === 'heat_cool'

  const hMax = Math.min(maxHeat - delta, maxCool - delta)
  const hMin = Math.max(minHeat, minCool)

  const cMax = Math.min(maxCool, maxHeat)
  const cMin = Math.max(minCool + delta, minHeat + delta)

  const updateHeat = (t: number) => {
    if (mode === 'heat_cool') {
      onHeatValueChange(Math.min(Math.max(t, hMin), hMax))
    } else {
      onHeatValueChange(Math.min(Math.max(t, minHeat), maxHeat))
    }
  }

  const updateCool = (t: number) => {
    if (mode === 'heat_cool') {
      onCoolValueChange(Math.min(Math.max(t, cMin), cMax))
    } else {
      onCoolValueChange(Math.min(Math.max(t, minCool), maxCool))
    }
  }

  useEffect(() => {
    if (coolValue < heatValue + delta) updateHeat(coolValue - delta)
  }, [coolValue, delta])

  useEffect(() => {
    if (heatValue > coolValue - delta) updateCool(heatValue + delta)
  }, [heatValue, delta])

  return (
    <div className='seam-temperature-control-group'>
      {showHeat && (
        <div className='seam-temperature-control-group-block'>
          <ThermostatHeatLargeIcon />
          <TemperatureControl
            variant='heat'
            value={heatValue}
            onChange={(t) => {
              updateHeat(t)
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
              updateCool(t)
            }}
            min={minCool}
            max={maxCool}
          />
        </div>
      )}
    </div>
  )
}
