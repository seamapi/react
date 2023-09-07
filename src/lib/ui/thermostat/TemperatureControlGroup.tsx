import { useEffect, useState } from 'react'

import { ThermostatCoolLargeIcon } from 'lib/icons/ThermostatCoolLarge.js'
import { ThermostatHeatLargeIcon } from 'lib/icons/ThermostatHeatLarge.js'
import { TemperatureControl } from 'lib/ui/thermostat/TemperatureControl.js'

interface TemperatureControlGroupProps {
  mode: 'heat' | 'cool' | 'heatcool'
  delta?: number
  minHeat?: number
  maxHeat?: number
  minCool?: number
  maxCool?: number
}

export function TemperatureControlGroup({
  mode,
  delta = 5,
  minHeat = 70,
  maxHeat = 100,
  minCool = 50,
  maxCool = 90,
}: TemperatureControlGroupProps): JSX.Element {
  const [heat, setHeat] = useState(70)
  const [cool, setCool] = useState(75)

  const showHeat = mode === 'heat' || mode === 'heatcool'
  const showCool = mode === 'cool' || mode === 'heatcool'

  const hMax = Math.min(maxHeat - delta, maxCool - delta)
  const hMin = Math.max(minHeat, minCool)

  const cMax = Math.min(maxCool, maxHeat)
  const cMin = Math.max(minCool + delta, minHeat + delta)

  const updateHeat = (t: number) => {
    if (mode === 'heatcool') {
      setHeat(Math.min(Math.max(t, hMin), hMax))
    } else {
      setHeat(Math.min(Math.max(t, minHeat), maxHeat))
    }
  }

  const updateCool = (t: number) => {
    if (mode === 'heatcool') {
      setCool(Math.min(Math.max(t, cMin), cMax))
    } else {
      setCool(Math.min(Math.max(t, minCool), maxCool))
    }
  }

  useEffect(() => {
    if (cool < heat + delta) updateHeat(cool - delta)
  }, [cool, delta])

  useEffect(() => {
    if (heat > cool - delta) updateCool(heat + delta)
  }, [heat, delta])

  return (
    <div className='seam-temperature-control-group'>
      {showHeat && (
        <div className='seam-temperature-control-group-block'>
          <ThermostatHeatLargeIcon />
          <TemperatureControl
            variant='heat'
            value={heat}
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
            value={cool}
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
