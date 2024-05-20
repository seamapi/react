import type { Event } from 'seamapi'

import { formatDateTime } from 'lib/dates.js'
import { ClockIcon } from 'lib/icons/Clock.js'

interface NoiseSensorEventItemProps {
  event: Event
}

export function NoiseSensorEventItem({
  event,
}: NoiseSensorEventItemProps): JSX.Element {
  const { date, time } = formatDateTime(event.created_at)

  return (
    <div className='seam-noise-sensor-event-item'>
      <div className='seam-noise-sensor-event-item-column-wrap'>
        <ClockIcon />

        <div className='seam-noise-sensor-event-item-datetime-wrap'>
          <p className='seam-noise-sensor-event-item-date'>{date}</p>
          <p className='seam-noise-sensor-event-item-time'>{time}</p>
        </div>
      </div>

      <div className='seam-noise-sensor-event-item-context-wrap'>
        <p className='seam-noise-sensor-event-item-context-label'>
          {getContextLabel(event)}
        </p>
        {getContextSublabel(event) != null && (
          <p className='seam-noise-sensor-event-item-context-sublabel'>
            {getContextSublabel(event)}
          </p>
        )}
      </div>

      <div className='seam-noise-sensor-event-item-right-block' />
    </div>
  )
}

function getContextLabel(event: Event): string {
  switch (event.event_type) {
    case 'noise_sensor.noise_threshold_triggered':
      return t.noiseThresholdTriggered
    case 'noise_detection.detected_noise':
      return t.detectedNoise
    default:
      return t.noiseDetected
  }
}

function getContextSublabel(event: Event): string | null {
  if (
    'noise_threshold_name' in event &&
    typeof event.noise_threshold_name === 'string'
  ) {
    return event.noise_threshold_name
  }

  if (
    'noise_level_decibels' in event &&
    typeof event.noise_level_decibels === 'number'
  ) {
    return `${event.noise_level_decibels} ${t.decibel}`
  }

  return null
}

const t = {
  detectedNoise: 'Noise detected',
  decibel: 'dB',
  noiseThresholdTriggered: 'Noise threshold triggered',
  noiseDetected: 'Noise detected',
}
