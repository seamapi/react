import type { SeamEvent } from '@seamapi/types/connect'
import { useState } from 'react'

import { useEvents } from 'lib/seam/events/use-events.js'
import type { NoiseSensorDevice } from 'lib/seam/noise-sensors/noise-sensor-device.js'
import { NoiseSensorEventItem } from 'lib/ui/noise-sensor/NoiseSensorEventItem.js'
import { useNow } from 'lib/ui/use-now.js'

interface NoiseSensorActivityListProps {
  device: NoiseSensorDevice
}

export function NoiseSensorActivityList({
  device,
}: NoiseSensorActivityListProps): JSX.Element {
  const now = useNow()
  const [mountedAt] = useState(now)

  const result = useEvents(
    {
      device_id: device.device_id,
      event_type: 'noise_sensor.noise_threshold_triggered',
      since: mountedAt.minus({ months: 1 }).toString(),
    },
    { refetchInterval: 30_000 }
  )

  // UPSTREAM: seam.events.list should return better types.
  const events = result.events as Array<
    Extract<SeamEvent, { event_type: 'noise_sensor.noise_threshold_triggered' }>
  >

  return (
    <div className='seam-noise-sensor-activity-list'>
      {events?.map((event) => (
        <NoiseSensorEventItem key={event.event_id} event={event} />
      ))}
    </div>
  )
}
