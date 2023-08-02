import type { ClimateSetting } from 'seamapi'

import { ThermostatCoolIcon } from 'lib/icons/ThermostatCool.js'
import { ThermostatHeatIcon } from 'lib/icons/ThermostatHeat.js'
import { ThermostatHeatCoolIcon } from 'lib/icons/ThermostatHeatCool.js'
import { ThermostatOffIcon } from 'lib/icons/ThermostatOff.js'

interface ClimateSettingStatusProps {
  climateSetting: ClimateSetting
  temperatureUnit?: 'fahrenheit' | 'celsius'
  iconPlacement?: 'left' | 'right'
}

export function ClimateSettingStatus({
  climateSetting,
  temperatureUnit = 'fahrenheit',
  iconPlacement = 'left',
}: ClimateSettingStatusProps): JSX.Element {
  return (
    <div className='seam-climate-setting-status'>
      {iconPlacement === 'left' && (
        <ClimateSettingIcon mode={climateSetting.hvac_mode_setting} />
      )}
      <Content
        mode={climateSetting.hvac_mode_setting}
        coolingSetPoint={climateSetting.cooling_set_point_fahrenheit}
        heatingSetPoint={climateSetting.heating_set_point_fahrenheit}
        temperatureUnit={temperatureUnit}
      />
      {iconPlacement === 'right' && (
        <ClimateSettingIcon mode={climateSetting.hvac_mode_setting} />
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
  coolingSetPoint:
    | ClimateSetting['cooling_set_point_fahrenheit']
    | ClimateSetting['cooling_set_point_celsius']
  heatingSetPoint:
    | ClimateSetting['heating_set_point_fahrenheit']
    | ClimateSetting['heating_set_point_celsius']
  temperatureUnit: 'fahrenheit' | 'celsius'
}): JSX.Element | null {
  const { mode, coolingSetPoint, heatingSetPoint, temperatureUnit } = props
  const hasCoolingSetPoint = coolingSetPoint !== undefined
  const hasHeatingSetPoint = heatingSetPoint !== undefined
  const unit =
    temperatureUnit === 'fahrenheit' ? t.degreeFahrenheit : t.degreeCelsius

  if (mode === 'cool' && hasCoolingSetPoint)
    return <span>{`${coolingSetPoint}${unit}`}</span>

  if (mode === 'heat' && hasHeatingSetPoint)
    return <span>{`${heatingSetPoint}${unit}`}</span>

  if (mode === 'heatcool' && hasHeatingSetPoint && hasCoolingSetPoint)
    return (
      <span>{`${heatingSetPoint}${unit} - ${coolingSetPoint}${unit}`}</span>
    )

  if (mode === 'off') return <span>{t.off}</span>

  return null
}

const t = {
  degreeFahrenheit: `\u00b0F`,
  degreeCelsius: `\u00b0C`,
  off: 'Off',
}
