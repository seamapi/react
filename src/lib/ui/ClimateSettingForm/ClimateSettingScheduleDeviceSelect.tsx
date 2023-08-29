import { DeviceTable } from 'lib/index.js'
import { isThermostatDevice } from 'seamapi'
import type { UseDeviceData, UseDevicesData } from '../../../hooks.js'

interface ClimateSettingScheduleDeviceSelectProps {
  devices: NonNullable<UseDeviceData>[]
  onBack?: () => void
  onSelect: (deviceId: string) => void
}

export const ClimateSettingScheduleDeviceSelect = ({
  devices,
  onBack,
  onSelect,
}: ClimateSettingScheduleDeviceSelectProps) => {
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
