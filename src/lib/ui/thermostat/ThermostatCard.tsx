import classNames from 'classnames'
import { useState } from 'react'

import { FanIcon } from 'lib/icons/Fan.js'
import { OffIcon } from 'lib/icons/Off.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'

import { useDevice } from '../../../hooks.js'

interface ThermostatCardProps {
  deviceId: string
}

export function ThermostatCard({ deviceId }: ThermostatCardProps): JSX.Element {
  return (
    <div className='seam-thermostat-card'>
      <Content deviceId={deviceId} />
    </div>
  )
}

function Content(props: { deviceId: string }): JSX.Element | null {
  const { deviceId } = props

  const { device } = useDevice({
    device_id: deviceId,
  })

  const [temperatureUnit, setTemperatureUnit] = useState<
    'fahrenheit' | 'celsius'
  >('fahrenheit')

  const toggleTemperatureScale = () => {
    setTemperatureUnit(
      temperatureUnit === 'fahrenheit' ? 'celsius' : 'fahrenheit'
    )
  }

  if (device == null) {
    return null
  }

  return (
    <div className='seam-thermostat-card-content'>
      <div className='seam-thermostat-card-image-wrap'>
        <DeviceImage device={device} />
      </div>
      <div className='seam-thermostat-card-details'>
        <div className='seam-thermostat-heading-wrap'>
          <h4 className='seam-thermostat-card-heading'>
            {device.properties.name}
          </h4>
          <button
            onClick={toggleTemperatureScale}
            className='seam-thermostat-temperature-toggle'
          >
            <span className='seam-thermostat-temperature-toggle-label'>
              º{temperatureUnit.slice(0, 1).toUpperCase()}
            </span>
          </button>
        </div>

        <div className='seam-thermostat-properties'>
          <div className='seam-thermostat-property-block'>
            <p className='seam-thermostat-property-label'>{t.temperature}:</p>
          </div>
          <div className='seam-thermostat-property-block'>
            <p className='seam-thermostat-property-value'>72º</p>
            <p className='seam-thermostat-property-value'>|</p>
            <p className='seam-thermostat-property-label'>{t.humidity}:</p>
            <p className='seam-thermostat-property-value'>52%</p>
          </div>
          <div className='seam-thermostat-property-block'>
            <p className='seam-thermostat-property-label'>{t.setting}:</p>
          </div>
          <div className='seam-thermostat-property-block'>
            {device.properties.current_climate_setting && (
              <ClimateSettingStatus
                climateSetting={device.properties.current_climate_setting}
                temperatureUnit={temperatureUnit}
              />
            )}
          </div>
          <div className='seam-thermostat-property-block'>
            <p className='seam-thermostat-property-label'>{t.fanMode}:</p>
          </div>
          <div className='seam-thermostat-property-block seam-thermostat-property-icon-block'>
            <div className='seam-thermostat-property-icon'>
              {device.properties.is_fan_running ? <FanIcon /> : <OffIcon />}
            </div>
            <p className='seam-thermostat-property-value'>
              {device.properties.is_fan_running ? t.auto : t.off}
            </p>
          </div>
          <div className='seam-thermostat-property-block'>
            <p className='seam-thermostat-property-label'>{t.systemStatus}:</p>
          </div>
          <div className='seam-thermostat-property-block'>
            <div
              className={classNames(
                'seam-thermostat-property-tag',
                `seam-thermostat-property-tag-${'cooling'}`
              )}
            >
              <p className='seam-thermostat-property-tag-label'>{t.cooling}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const t = {
  fahrenheit: 'F',
  celsius: 'C',
  auto: 'Auto',
  off: 'Off',
  temperature: 'Temperature',
  humidity: 'Humidity',
  setting: 'Setting',
  fanMode: 'Fan mode',
  systemStatus: 'System status',
  cooling: 'Cooling',
  heating: 'Heating',
}
