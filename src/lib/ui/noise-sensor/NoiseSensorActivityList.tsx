<<<<<<< HEAD
import { useEvents } from 'lib/seam/events/use-events.js'
import { NoiseSensorEventItem } from 'lib/ui/noise-sensor/NoiseSensorEventItem.js'
=======
>>>>>>> 4393fa0eb9f4d55fa0ab31fb392bc6f53df5f5ae
import type { NoiseSensorDevice } from 'seamapi'

import { useEvents } from 'lib/seam/events/use-events.js'

const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
interface NoiseSensorActivityListProps {
  device: NoiseSensorDevice
}

export function NoiseSensorActivityList({
  device,
}: NoiseSensorActivityListProps): JSX.Element {
  const { events } = useEvents({
    device_id: device.device_id,
    event_type: 'noise_detection.detected_noise',
    since,
  })

  return (
    <div className='seam-noise-sensor-activity-list'>
      {events?.map((event) => (
        <NoiseSensorEventItem key={event.event_id} event={event} />
      ))}
    </div>
  )
}
