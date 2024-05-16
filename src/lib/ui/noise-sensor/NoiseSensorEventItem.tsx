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
        <p className='seam-noise-sensor-event-item-context-label'>{`Noisy (${event.noise_level_decibels} dB)`}</p>
        <p className='seam-noise-sensor-event-item-context-sublabel'>Kitchen</p>
      </div>
    </div>
  )
}
