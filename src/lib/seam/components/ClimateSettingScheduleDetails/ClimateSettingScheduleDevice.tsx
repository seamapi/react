import { isThermostatDevice, type ThermostatDevice } from 'seamapi'

import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { useDevice } from 'lib/seam/devices/use-device.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'

export function ClimateSettingDevice({
  deviceId,
  onSelectDevice,
}: {
  deviceId: string
  onSelectDevice: (deviceId: string) => void
}): JSX.Element | null {
  const { isLoading, device } = useDevice({
    device_id: deviceId,
  })

  if (isLoading) {
    return null
  }

  if (device == null) {
    return null
  }

  if (!isThermostatDevice(device)) {
    return null
  }

  return <Content device={device} onSelectDevice={onSelectDevice} />
}

function Content(props: {
  device: ThermostatDevice
  onSelectDevice: (deviceId: string) => void
}): JSX.Element {
  const { device, onSelectDevice } = props

  return (
    <div className='seam-climate-setting-schedule-device'>
      <div className='seam-device-image'>
        <DeviceImage device={device} />
      </div>
      <div className='seam-body'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
          <div className='seam-device-name'>{device.properties.name}</div>
          <div className='seam-device-current-climate-setting'>
            {' '}
            Current climate:{' '}
            <ClimateSettingStatus
              climateSetting={device.properties.current_climate_setting}
            />
          </div>
        </div>
        <ChevronRightIcon className='chevron' />
      </div>
    </div>
  )
}

const t = {
  deviceDetails: 'Device details',
}
