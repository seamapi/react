import type { NoiseSensorDevice } from 'seamapi'

import { NoiseLevelsIcon } from 'lib/icons/NoiseLevels.js'

interface NoiseLevelStatusProps {
  device: NoiseSensorDevice
}

export function NoiseLevelStatus({ device }: NoiseLevelStatusProps) {
  return (
    <>
      <span className='seam-label'>{t.noiseLevel}:</span>

      <div className='seam-device-status'>
        <NoiseLevelsIcon />
        <span className='seam-text'>{getNoiseLevel(device)}</span>
      </div>
    </>
  )
}

function toNoiseString(value: number | string | undefined): string {
  if (!value) {
    return t.unknown
  }
  return `${Number(value).toFixed(0)} ${t.decibel}`
}

function getNoiseLevel(device: NoiseSensorDevice): string {
  const isMinut = device.device_type === 'minut_sensor'
  const isNoiseAware = device.device_type === 'noiseaware_activity_zone'

  if (isMinut) {
    return toNoiseString(
      device?.properties?.minut_metadata?.latest_sensor_values?.sound?.value
    )
  }

  if (isNoiseAware) {
    if (device?.properties?.noiseaware_metadata?.noise_level_nrs === -1) {
      return t.noiseAwareDefault
    }
    return toNoiseString(
      device?.properties?.noiseaware_metadata?.noise_level_decibel
    )
  }

  return toNoiseString(undefined)
}

const t = {
  noiseLevel: 'Noise level',
  unknown: 'Unknown',
  decibel: 'dB',
  noiseAwareDefault: '0-40 dB',
}
