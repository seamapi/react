import type { Device } from '@seamapi/types/connect'

import { defaultDeviceFilter, DeviceTable } from 'lib/index.js'
import { isThermostatDevice } from 'lib/seam/thermostats/thermostat-device.js'

interface ThermostatSelectProps {
  onSelect: (deviceId: string) => void
}

const deviceFilter = (device: Device, searchInputValue: string): boolean => {
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
