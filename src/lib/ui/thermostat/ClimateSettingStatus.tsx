import { ThermostatCoolIcon } from 'lib/icons/ThermostatCool.js'
import { ThermostatHeatIcon } from 'lib/icons/ThermostatHeat.js'
import { ThermostatHeatCoolIcon } from 'lib/icons/ThermostatHeatCool.js'
import { ThermostatOffIcon } from 'lib/icons/ThermostatOff.js'
import type { ClimateSetting } from 'lib/seam/thermostats/thermostat-device.js'
import { Temperature } from 'lib/ui/thermostat/Temperature.js'

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
        coolingSetPoint={{
          fahrenheit: climateSetting.cooling_set_point_fahrenheit,
          celsius: climateSetting.cooling_set_point_celsius,
        }}
        heatingSetPoint={{
          fahrenheit: climateSetting.heating_set_point_fahrenheit,
          celsius: climateSetting.heating_set_point_celsius,
        }}
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
      {mode === 'heat_cool' && <ThermostatHeatCoolIcon />}
      {mode === 'off' && <ThermostatOffIcon />}
    </div>
  )
}

interface SetPoint {
  fahrenheit: number
  celsius: number
}

function Content(props: {
  mode: ClimateSetting['hvac_mode_setting']
  coolingSetPoint: Partial<SetPoint>
  heatingSetPoint: Partial<SetPoint>
  temperatureUnit: 'fahrenheit' | 'celsius'
}): JSX.Element | null {
  const { mode, coolingSetPoint, heatingSetPoint, temperatureUnit } = props

  if (mode === 'cool' && isSetPoint(coolingSetPoint))
    return <Temperature {...coolingSetPoint} unit={temperatureUnit} />

  if (mode === 'heat' && isSetPoint(heatingSetPoint))
    return <Temperature {...heatingSetPoint} unit={temperatureUnit} />

  if (
    mode === 'heat_cool' &&
    isSetPoint(heatingSetPoint) &&
    isSetPoint(coolingSetPoint)
  )
    return (
      <span>
        <Temperature {...heatingSetPoint} unit={temperatureUnit} />
        {' - '}
        <Temperature {...coolingSetPoint} unit={temperatureUnit} />
      </span>
    )

  if (mode === 'off') return <span>{t.off}</span>

  return null
}

function isSetPoint(setPoint: Partial<SetPoint>): setPoint is SetPoint {
  return setPoint.fahrenheit != null && setPoint.celsius != null
}

const t = {
  off: 'Off',
}
