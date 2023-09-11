import { isThermostatDevice } from 'seamapi'

import {
  DeviceTable,
  type UseDevicesData,
} from 'lib/seam/devices/use-devices.js'

interface ClimateSettingScheduleDeviceSelectProps {
  onSelect: (deviceId: string) => void
}

const deviceFilter = (
  device: UseDevicesData[number],
  searchInputValue: string
): boolean => {
  if (!isThermostatDevice(device)) return false
  const value = searchInputValue.trim()
  if (value === '') return true
  return device.properties.name.toLowerCase().includes(value)
}

export function ClimateSettingScheduleDeviceSelect({
  onSelect,
}: ClimateSettingScheduleDeviceSelectProps): JSX.Element {
  return (
    <DeviceTable
      deviceFilter={deviceFilter}
      preventDefaultOnDeviceClick
      onDeviceClick={onSelect}
    />
  )
}
