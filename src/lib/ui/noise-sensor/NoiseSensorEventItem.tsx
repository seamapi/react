import type { SeamEvent } from '@seamapi/types/connect'
import { DateTime } from 'luxon'

import { ClockIcon } from 'lib/icons/Clock.js'

type NoiseSensorNoiseThresholdTriggeredEvent = Extract<
  SeamEvent,
  { event_type: 'noise_sensor.noise_threshold_triggered' }
>

interface NoiseSensorEventItemProps {
  event: NoiseSensorNoiseThresholdTriggeredEvent
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

const getContextSublabel = (
  event: NoiseSensorNoiseThresholdTriggeredEvent
): string | null => {
  if (event.noise_threshold_name != null) {
    return event.noise_threshold_name
  }

  if (event.noise_level_decibels != null) {
    return `${event.noise_level_decibels} ${t.decibel}`
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
