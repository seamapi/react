import { type ReactElement } from 'react'
import { type CommonDeviceProperties, type Device } from 'seamapi'

import { useDevices, type UseDevicesParams } from 'lib/hooks/use-devices.js'

export type DeviceManagerProps = UseDevicesParams

/**
 * Fetch, list, and manage devices.
 */
export const DeviceManager = (props: DeviceManagerProps): ReactElement => {
  const { devices, isLoading, isError, error } = useDevices(props)

  if (isLoading) return <p role='loading'>{t.loading}</p>
  if (isError) return <p>{error?.message}</p>

  return (
    <ul>
      {devices?.map((device) => (
        <DeviceManagerItem key={device.device_id} {...device} />
      ))}
    </ul>
  )
}

const DeviceManagerItem = (
  props: Device<CommonDeviceProperties>
): ReactElement => {
  return (
    <li>
      <p>{t.device_id}: {props.device_id}</p>
      <p>{t.name}: {props.properties.name}</p>
    </li>
  )
}

const t = {
  loading: 'Loading devices',
  device_id: 'Device ID',
  name: 'Device name'
}
