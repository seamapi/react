import type { Device } from '@seamapi/types/connect'

export type NoiseSensorDevice = Omit<Device, 'properties'> & {
  properties: Device['properties'] &
    NonNullable<Required<Pick<Device['properties'], 'noise_level_decibels'>>>
}

export const isNoiseSensorDevice = (
  device: Device
): device is NoiseSensorDevice => 'noise_level_decibels' in device.properties
