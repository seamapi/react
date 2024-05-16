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
      <ClockIcon />

      <div className='seam-noise-sensor-event-item-datetime-wrap'>
        <p className='seam-noise-sensor-event-item-date'>{date}</p>
        <p className='seam-noise-sensor-event-item-time'>{time}</p>
      </div>
    </div>
  )
}
