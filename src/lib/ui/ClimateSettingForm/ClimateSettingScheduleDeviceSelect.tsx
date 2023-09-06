import { isThermostatDevice } from 'seamapi'

import { DeviceTable } from 'lib/index.js'

import type { UseDevicesData } from '../../../hooks.js'

interface ClimateSettingScheduleDeviceSelectProps {
  // devices: NonNullable<UseDeviceData>[]
  onSelect: (deviceId: string) => void
}

export function ClimateSettingScheduleDeviceSelect({
  // devices,
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

const t = {
  tableHeader: 'Choose a device',
  done: 'Done',
}
