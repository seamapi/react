import classNames from 'classnames'
import type { NoiseSensorDevice } from 'seamapi'

import { NoiseLevelsIcon } from 'lib/icons/NoiseLevels.js'
import { NoiseLevelsRedIcon } from 'lib/icons/NoiseLevelsRed.js'

interface NoiseLevelStatusProps {
  device: NoiseSensorDevice
}

export function NoiseLevelStatus({
  device,
}: NoiseLevelStatusProps): JSX.Element {
  const isActivated =
    device.properties.currently_triggering_noise_threshold_ids?.length <= 0

  return (
    <>
      <span className='seam-label'>{t.noiseLevel}:</span>

      <div className='seam-device-status'>
        {isActivated ? <NoiseLevelsRedIcon /> : <NoiseLevelsIcon />}
        <span
          className={classNames('seam-text', isActivated && 'seam-text-danger')}
        >
          {getNoiseLevel(device)}
          {isActivated && ` (${t.noisy})`}
        </span>
      </div>
    </>
  )
}

function toNoiseString(value: number | string | undefined): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return `${Number(value).toFixed(0)} ${t.decibel}`
  }
  return t.unknown
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
  noisy: 'noisy',
}
