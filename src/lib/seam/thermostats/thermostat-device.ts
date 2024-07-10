import type { Device } from '@seamapi/types/connect'

export type ThermostatDevice = Omit<Device, 'properties'> & {
  properties: Device['properties'] &
    Required<Pick<Device['properties'], 'is_fan_running'>>
}

export const isThermostatDevice = (
  device: Device
): device is ThermostatDevice => 'is_fan_running' in device.properties
