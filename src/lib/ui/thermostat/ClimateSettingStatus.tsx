import { ThermostatCoolIcon } from 'lib/icons/ThermostatCool.js'
import { ThermostatHeatIcon } from 'lib/icons/ThermostatHeat.js'
import { ThermostatHeatCoolIcon } from 'lib/icons/ThermostatHeatCool.js'
import { ThermostatOffIcon } from 'lib/icons/ThermostatOff.js'

import type { ClimateSetting } from 'seamapi'

interface ClimateSettingStatusProps {
  setting: ClimateSetting
  iconPlacement?: 'left' | 'right'
}

export function ClimateSettingStatus({
  setting,
  iconPlacement = 'left',
}: ClimateSettingStatusProps): JSX.Element {
  return (
    <div className='seam-climate-setting-status'>
      {iconPlacement === 'left' && (
        <ClimateSettingIcon mode={setting.hvac_mode_setting} />
      )}
      <Content
        mode={setting.hvac_mode_setting}
        coolingSetPoint={setting.cooling_set_point_fahrenheit}
        heatingSetPoint={setting.heating_set_point_fahrenheit}
      />
      {iconPlacement === 'right' && (
        <ClimateSettingIcon mode={setting.hvac_mode_setting} />
      )}
    </div>
  )
}

function ClimateSettingIcon(props: {
  mode: ClimateSetting['hvac_mode_setting']
}): JSX.Element | null {
  const { mode } = props

  return (
    <div className='seam-climate-setting-status-icon'>
      {mode === 'cool' && <ThermostatCoolIcon />}
      {mode === 'heat' && <ThermostatHeatIcon />}
      {mode === 'heatcool' && <ThermostatHeatCoolIcon />}
      {mode === 'off' && <ThermostatOffIcon />}
    </div>
  )
}

function Content(props: {
  mode: ClimateSetting['hvac_mode_setting']
  coolingSetPoint: ClimateSetting['cooling_set_point_fahrenheit']
  heatingSetPoint: ClimateSetting['cooling_set_point_fahrenheit']
}): JSX.Element | null {
  const { mode, coolingSetPoint, heatingSetPoint } = props

  if (mode === 'cool') return <span>{`${coolingSetPoint}${t.degree}F`}</span>

  if (mode === 'heat') return <span>{`${heatingSetPoint}${t.degree}F`}</span>

  if (mode === 'heatcool')
    return (
      <span>{`${heatingSetPoint}${t.degree}F - ${coolingSetPoint}${t.degree}F`}</span>
    )

  if (mode === 'off') return <span>{`Off`}</span>

  return null
}

const t = {
  degree: `\u00b0`,
}
