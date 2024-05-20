import { DateTime } from 'luxon'
import type { Event } from 'seamapi'

import { ClockIcon } from 'lib/icons/Clock.js'

const ABBREVIATED_DATE_FORMAT = 'MMM d, yyyy'
const TIME_FORMAT = 'h:mm a'

interface NoiseSensorEventItemProps {
  event: Event
}

export function NoiseSensorEventItem({
  event,
}: NoiseSensorEventItemProps): JSX.Element {
  const date = formatDate(event.created_at)
  const time = formatTime(event.created_at)

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
          {t.noiseThresholdTriggered}
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

function getContextSublabel(event: Event): string | null {
  if ('noise_threshold_name' in event) {
    return `${event.noise_threshold_name}`
  }

  if ('noise_level_decibels' in event) {
    return `${event.noise_level_decibels} ${t.decibel}`
  }

  return null
}

const formatDate = (dateTime: string) =>
  DateTime.fromISO(dateTime).toFormat(ABBREVIATED_DATE_FORMAT)

const formatTime = (dateTime: string) =>
  DateTime.fromISO(dateTime).toFormat(TIME_FORMAT)

const t = {
  decibel: 'dB',
  noiseThresholdTriggered: 'Noise threshold triggered',
}
