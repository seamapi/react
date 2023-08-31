import type { ClimateSetting } from 'seamapi'

import { ThermostatCoolIcon } from 'lib/icons/ThermostatCool.js'
import { ThermostatHeatIcon } from 'lib/icons/ThermostatHeat.js'
import { ThermostatHeatCoolIcon } from 'lib/icons/ThermostatHeatCool.js'
import { ThermostatOffIcon } from 'lib/icons/ThermostatOff.js'
import { Temperature } from 'lib/ui/thermostat/Temperature.js'

interface SetPoint {
  fahrenheit: number
  celsius: number
}

interface ClimateSettingStatusProps {
  climateSetting: Partial<ClimateSetting>
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
          fahrenheit: formatTemperatureValue(
            climateSetting.cooling_set_point_fahrenheit
          ),
          celsius: formatTemperatureValue(
            climateSetting.cooling_set_point_celsius
          ),
        }}
        heatingSetPoint={{
          fahrenheit: formatTemperatureValue(
            climateSetting.heating_set_point_fahrenheit
          ),
          celsius: formatTemperatureValue(
            climateSetting.heating_set_point_celsius
          ),
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
      {mode === 'heatcool' && <ThermostatHeatCoolIcon />}
      {mode === 'off' && <ThermostatOffIcon />}
    </div>
  )
}

function Content(props: {
  mode: ClimateSetting['hvac_mode_setting']
  coolingSetPoint: SetPoint
  heatingSetPoint: SetPoint
  temperatureUnit: 'fahrenheit' | 'celsius'
}): JSX.Element | null {
  const { mode, coolingSetPoint, heatingSetPoint, temperatureUnit } = props
  const hasCoolingSetPoint = coolingSetPoint !== undefined
  const hasHeatingSetPoint = heatingSetPoint !== undefined

  if (mode === 'cool' && hasCoolingSetPoint)
    return (
      <Temperature
        fahrenheit={coolingSetPoint.fahrenheit}
        celsius={coolingSetPoint.celsius}
        unit={temperatureUnit}
      />
    )

  if (mode === 'heat' && hasHeatingSetPoint)
    return (
      <Temperature
        fahrenheit={heatingSetPoint.fahrenheit}
        celsius={heatingSetPoint.celsius}
        unit={temperatureUnit}
      />
    )

  if (mode === 'heatcool' && hasHeatingSetPoint && hasCoolingSetPoint)
    return (
      <span>
        <Temperature
          fahrenheit={heatingSetPoint.fahrenheit}
          celsius={heatingSetPoint.celsius}
          unit={temperatureUnit}
        />
        {' - '}
        <Temperature
          fahrenheit={coolingSetPoint.fahrenheit}
          celsius={coolingSetPoint.celsius}
          unit={temperatureUnit}
        />
      </span>
    )

  if (mode === 'off') return <span>{t.off}</span>

  return null
}

const formatTemperatureValue = (value: number | undefined): number => {
  if (value == null) return 0
  return Math.trunc(value)
}

const t = {
  off: 'Off',
}
