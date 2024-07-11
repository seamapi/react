import type { SeamEvent } from '@seamapi/types/connect'
import { DateTime } from 'luxon'

import { ClockIcon } from 'lib/icons/Clock.js'

interface NoiseSensorEventItemProps {
  event: SeamEvent
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

const getContextSublabel = (event: SeamEvent): string | null => {
  if ('noise_threshold_name' in event) {
    // @ts-expect-error UPSTREAM: Shallow event type
    // https://github.com/seamapi/react/issues/611
    return event.noise_threshold_name
  }

  if ('noise_level_decibels' in event) {
    // UPSTREAM: Shallow event types.
    return `${event.noise_level_decibels as string} ${t.decibel}`
  }

  return null
}

const formatDate = (dateTime: string): string =>
  DateTime.fromISO(dateTime).toLocaleString(DateTime.DATE_FULL)

const formatTime = (dateTime: string): string =>
  DateTime.fromISO(dateTime).toLocaleString(DateTime.TIME_SIMPLE)

const t = {
  decibel: 'dB',
  noiseThresholdTriggered: 'Noise threshold triggered',
}
