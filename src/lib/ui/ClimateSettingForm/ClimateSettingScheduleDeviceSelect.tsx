import { isThermostatDevice } from 'seamapi'

import { DeviceTable, type UseDevicesData } from 'lib/index.js'

interface ClimateSettingScheduleDeviceSelectProps {
  onSelect: (deviceId: string) => void
}

export function ClimateSettingScheduleDeviceSelect({
  onSelect,
}: ClimateSettingScheduleDeviceSelectProps) {
  const deviceFilter = (
    device: UseDevicesData[number],
    searchInputValue: string
  ): boolean => {
    if (!isThermostatDevice(device)) return false
    const value = searchInputValue.trim()
    if (value === '') return true
    return device.properties.name.toLowerCase().includes(value)
  }

  return (
    <>
      <DeviceTable
        deviceFilter={deviceFilter}
        preventDefaultOnDeviceClick
        onDeviceClick={onSelect}
      />
    </>
  )
}