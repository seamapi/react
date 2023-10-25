import type { HvacModeSetting } from 'seamapi'

import { ClimateModeMenu } from 'lib/ui/thermostat/ClimateModeMenu.js'
import {
  TemperatureControlGroup,
  type TemperatureControlGroupProps,
} from 'lib/ui/thermostat/TemperatureControlGroup.js'

type ClimateSettingControlGroupProps = Omit<
  TemperatureControlGroupProps,
  'mode'
> & {
  mode: HvacModeSetting
  onModeChange: (mode: HvacModeSetting) => void
}

export function ClimateSettingControlGroup(
  props: ClimateSettingControlGroupProps
): JSX.Element {
  const { mode, onModeChange, ...rest } = props
  return (
    <div className='seam-climate-setting-control-group'>
      <ClimateModeMenu mode={mode} onChange={onModeChange} />

      {mode !== 'off' && (
        <div className='seam-climate-setting-slider-container'>
          <TemperatureControlGroup mode={mode} {...rest} />
        </div>
      )}
    </div>
  )
}
