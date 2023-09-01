import { useEffect, useState } from 'react'

import { ThermostatCoolLargeIcon } from 'lib/icons/ThermostatCoolLarge.js'
import { ThermostatHeatLargeIcon } from 'lib/icons/ThermostatHeatLarge.js'
import { TemperatureControl } from 'lib/ui/thermostat/TemperatureControl.js'

interface TemperatureControlGroupProps {
  mode: 'heat' | 'cool' | 'heatcool'
  delta?: number
}

export function TemperatureControlGroup({
  mode,
  delta = 5,
}: TemperatureControlGroupProps): JSX.Element {
  const [heat, setHeat] = useState(75)
  const [cool, setCool] = useState(70)

  const showHeat = mode === 'heat' || mode === 'heatcool'
  const showCool = mode === 'cool' || mode === 'heatcool'

  useEffect(() => {
    if (heat < cool + delta) setCool(heat - delta)
  }, [heat, delta])

  return (
    <div className='seam-temperature-control-group'>
      {showHeat && (
        <div className='seam-temperature-control-group-block'>
          <ThermostatHeatLargeIcon />
          <TemperatureControl
            variant='heat'
            value={heat}
            onChange={(t) => { setHeat(t); }}
          />
        </div>
      )}

      {showCool && (
        <div className='seam-temperature-control-group-block'>
          <ThermostatCoolLargeIcon />
          <TemperatureControl
            variant='cool'
            value={cool}
            onChange={(t) => { setCool(t); }}
          />
        </div>
      )}
    </div>
  )
}
