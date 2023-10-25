import type { HvacModeSetting } from 'seamapi'

import { ClimateModeMenu } from 'lib/ui/thermostat/ClimateModeMenu.js'
import { TemperatureControlGroup } from 'lib/ui/thermostat/TemperatureControlGroup.js'

interface ClimateSettingControlGroupProps {
  mode: HvacModeSetting
  onModeChange: (mode: HvacModeSetting) => void
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

export function ClimateSettingControlGroup({
  mode,
  onModeChange,
  heatValue,
  onHeatValueChange,
  coolValue,
  onCoolValueChange,
  delta,
  minHeat,
  maxHeat,
  minCool,
  maxCool,
}: ClimateSettingControlGroupProps): JSX.Element {
  return (
    <div className='seam-climate-setting-control-group'>
      <ClimateModeMenu mode={mode} onChange={onModeChange} />

      {mode !== 'off' && (
        <div className='seam-climate-setting-slider-container'>
          <TemperatureControlGroup
            coolValue={coolValue}
            heatValue={heatValue}
            delta={delta}
            maxCool={maxCool}
            maxHeat={maxHeat}
            minCool={minCool}
            minHeat={minHeat}
            mode={mode}
            onCoolValueChange={onCoolValueChange}
            onHeatValueChange={onHeatValueChange}
          />
        </div>
      )}
    </div>
  )
}
