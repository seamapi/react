import { DeviceImage } from 'lib/ui/device/DeviceImage.js'

import { useDevice } from '../../../hooks.js'
import { useState } from 'react'

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

  const [temperatureScale, setTemperatureScale] = useState<'f' | 'c'>('f')

  const toggleTemperatureScale = () => {
    setTemperatureScale(temperatureScale === 'f' ? 'c' : 'f')
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
            <span>º{temperatureScale.toUpperCase()}</span>
          </button>
        </div>

        <div className='seam-thermostat-properties'></div>
      </div>
    </div>
  )
}
