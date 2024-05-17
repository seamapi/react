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
        {getContextSublabel(event) && (
          <p className='seam-noise-sensor-event-item-context-sublabel'>
            {getContextSublabel(event)}
          </p>
        )}
      </div>

      <div className='seam-noise-sensor-event-item-right-block'></div>
    </div>
  )
}

function getContextLabel(event: Event): string {
  switch (event.event_type) {
    case 'noise_sensor.noise_threshold_triggered':
      return `${t.noiseThresholdTriggered} ${'noise_threshold_name' in event && `(${event.noise_threshold_name})`}`
    case 'noise_detection.detected_noise':
      return `${t.detectedNoise} ${'noise_level_decibels' in event ? `(${event.noise_level_decibels} ${t.decibel})` : ''}`
    default:
      return t.noiseDetected
  }
}

function getContextSublabel(event: Event): string {
  if ('noise_level_decibels' in event) {
    return `${event.noise_level_decibels} ${t.decibel}`
  }

  if (
    'noise_threshold_name' in event &&
    typeof event.noise_threshold_name === 'string'
  ) {
    return event.noise_threshold_name
  }

  return ''
}

const t = {
  detectedNoise: 'Noise detected',
  decibel: 'dB',
  noiseThresholdTriggered: 'Noise threshold triggered',
  noiseDetected: 'Noise detected',
}
