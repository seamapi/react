import { isThermostatDevice, type ThermostatDevice } from 'seamapi'

import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { useDevice } from 'lib/seam/devices/use-device.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'

export function ClimateSettingDevice({
  deviceId,
}: {
  deviceId: string
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

  return <Content device={device} />
}

function Content(props: { device: ThermostatDevice }): JSX.Element {
  const { device } = props

  return (
    <div className='seam-climate-setting-schedule-device-bar'>
      <div className='seam-climate-setting-schedule-device-content'>
        <div className='seam-device-image'>
          <DeviceImage device={device} />
        </div>
        <div className='seam-climate-setting-schedule-device-details'>
          <div className='seam-device-name'>{device.properties.name}</div>
          <div className='seam-device-current-climate-setting'>
            Current climate:
            <ClimateSettingStatus
              climateSetting={device.properties.current_climate_setting}
            />
          </div>
        </div>
      </div>
      <ChevronRightIcon className='chevron' />
    </div>
  )
}
