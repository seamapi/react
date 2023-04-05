import { type ReactElement } from 'react'

import { useDevices } from 'lib/hooks/use-devices.js'
import { type Device } from 'lib/seam-client-stub.js'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeviceListProps {
  manufacturer?: string
}

export const DeviceList = ({ manufacturer }: DeviceListProps): ReactElement => {
  const { devices, isLoading, isError, error } = useDevices()

  if (isLoading) return <p role='loading'>{i18nStub.loading}</p>
  if (isError) return <p>${error?.message}</p>

  return (
    <ul>
      {devices
        ?.filter((device) =>
          manufacturer == null ? true : device.manufacturer === manufacturer
        )
        ?.map((device) => (
          <DeviceListItem key={device.device_id} {...device} />
        ))}
    </ul>
  )
}

const DeviceListItem = (props: Device): ReactElement => {
  return (
    <li>
      {i18nStub.device_id}: {props.device_id}
      <br />
      {i18nStub.manufacturer}: {props.manufacturer}
    </li>
  )
}

const i18nStub = {
  loading: 'Loading devices',
  device_id: 'Device ID',
  manufacturer: 'Device manufacturer'
}
