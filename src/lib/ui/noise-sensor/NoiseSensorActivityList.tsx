import { useEvents } from 'lib/seam/events/use-events.js'
import type { NoiseSensorDevice } from 'seamapi'

const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
interface NoiseSensorActivityListProps {
  device: NoiseSensorDevice
}

export function NoiseSensorActivityList({
  device,
}: NoiseSensorActivityListProps): JSX.Element {
  console.log('Rendering...')
  const { events } = useEvents({
    device_id: device.device_id,
    event_type: 'noise_detection.detected_noise',
    since,
  })

  return (
    <div className='seam-noise-sensor-activity-list'>
      {events?.map((event) => (
        <div key={event.event_id}>{event.event_id}</div>
      ))}
    </div>
  )
}
