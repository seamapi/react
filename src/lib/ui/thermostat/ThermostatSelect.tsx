import {
  defaultDeviceFilter,
  DeviceTable,
  type UseDevicesData,
} from 'lib/index.js'
import { isThermostatDevice } from 'lib/seam/thermostats/thermostat-device.js'

interface ThermostatSelectProps {
  onSelect: (deviceId: string) => void
}

const deviceFilter = (
  device: UseDevicesData[number],
  searchInputValue: string
): boolean => {
  if (!isThermostatDevice(device)) return false
  return defaultDeviceFilter(device, searchInputValue)
}

export function ThermostatSelect({
  onSelect,
}: ThermostatSelectProps): JSX.Element {
  return (
    <DeviceTable
      deviceFilter={deviceFilter}
      preventDefaultOnDeviceClick
      onDeviceClick={onSelect}
    />
  )
}
