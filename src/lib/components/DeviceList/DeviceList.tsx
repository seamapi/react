import { type ReactElement } from 'react'
import { type CommonDeviceProperties, type Device } from 'seamapi'

import { useDevices, type UseDevicesParams } from 'lib/hooks/use-devices.js'

export interface DeviceListProps {
  manufacturer?: string | undefined
}

/**
 * Fetch and list devices.
 */
export const DeviceList = (props: UseDevicesParams): ReactElement => {
  const { devices, isLoading, isError, error } = useDevices(props)

  if (isLoading) return <p role='loading'>{i18nStub.loading}</p>
  if (isError) return <p>{error?.message}</p>

  return (
    <ul>
      {devices?.map((device) => (
        <DeviceListItem key={device.device_id} {...device} />
      ))}
    </ul>
  )
}

const DeviceListItem = (
  props: Device<CommonDeviceProperties>
): ReactElement => {
  return (
    <li>
      {i18nStub.device_id}: {props.device_id}
      <br />
      {i18nStub.name}: {props.properties.name}
    </li>
  )
}

const i18nStub = {
  loading: 'Loading devices',
  device_id: 'Device ID',
  name: 'Device name'
}
