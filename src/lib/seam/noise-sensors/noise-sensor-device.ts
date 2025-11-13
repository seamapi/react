import type { Device } from '@seamapi/types/connect'

export type NoiseSensorDevice = Omit<Device, 'properties'> & {
  properties: Device['properties'] &
    NonNullable<Required<Pick<Device['properties'], 'noise_level_decibels'>>>
}

export const isNoiseSensorDevice = (
  device: Device
): device is NoiseSensorDevice =>  device.properties.noise_level_decibels != null
