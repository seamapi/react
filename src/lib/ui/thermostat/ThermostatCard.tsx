import classNames from 'classnames'
import { useState } from 'react'
import type { ClimateSetting } from 'seamapi'

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

  const toggleTemperatureScale = (): void => {
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
          {'temperature_fahrenheit' in device.properties &&
            'temperature_celsius' in device.properties && (
              <>
                <div className='seam-thermostat-property-block'>
                  <p className='seam-thermostat-property-label'>
                    {t.temperature}:
                  </p>
                </div>
                <div className='seam-thermostat-property-block'>
                  <p className='seam-thermostat-property-value'>
                    {Math.trunc(
                      Number(
                        temperatureUnit === 'fahrenheit'
                          ? device.properties.temperature_fahrenheit
                          : device.properties.temperature_celsius
                      )
                    )}
                    º
                  </p>
                  {'relative_humidity' in device.properties && (
                    <>
                      <p className='seam-thermostat-property-value'>|</p>
                      <p className='seam-thermostat-property-label'>
                        {t.humidity}:
                      </p>
                      <p className='seam-thermostat-property-value'>
                        {Number(device.properties.relative_humidity) * 100}%
                      </p>
                    </>
                  )}
                </div>
              </>
            )}

          {'current_climate_setting' in device.properties &&
            'hvac_mode_setting' in
              (device.properties
                ?.current_climate_setting as ClimateSetting) && (
              <>
                <div className='seam-thermostat-property-block'>
                  <p className='seam-thermostat-property-label'>{t.setting}:</p>
                </div>
                <div className='seam-thermostat-property-block'>
                  <ClimateSettingStatus
                    climateSetting={
                      device.properties
                        .current_climate_setting as ClimateSetting
                    }
                    temperatureUnit={temperatureUnit}
                  />
                </div>
              </>
            )}

          {'is_fan_running' in device.properties && (
            <>
              <div className='seam-thermostat-property-block'>
                <p className='seam-thermostat-property-label'>{t.fanMode}:</p>
              </div>
              <div className='seam-thermostat-property-block seam-thermostat-property-icon-block'>
                <div className='seam-thermostat-property-icon'>
                  {device.properties.is_fan_running === true ? (
                    <FanIcon />
                  ) : (
                    <OffIcon />
                  )}
                </div>
                <p className='seam-thermostat-property-value'>
                  {device.properties.is_fan_running === true ? t.auto : t.off}
                </p>
              </div>
            </>
          )}

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
