import type { NoiseSensorDevice } from 'seamapi'

import { useEvents } from 'lib/seam/events/use-events.js'
import { NoiseSensorEventItem } from 'lib/ui/noise-sensor/NoiseSensorEventItem.js'
import { useState } from 'react'
import { useNow } from 'lib/ui/use-now.js'

interface NoiseSensorActivityListProps {
  device: NoiseSensorDevice
}

export function NoiseSensorActivityList({
  device,
}: NoiseSensorActivityListProps): JSX.Element {
  const date = useNow()
  const [since] = useState(date)

  const { events } = useEvents({
    device_id: device.device_id,
    event_types: [
      'noise_detection.detected_noise',
      'noise_sensor.noise_threshold_triggered',
    ],
    since: since.minus({ months: 1 }).toString(),
  })

  return (
    <div className='seam-noise-sensor-activity-list'>
      {events?.map((event) => (
        <NoiseSensorEventItem key={event.event_id} event={event} />
      ))}
    </div>
  )
}
