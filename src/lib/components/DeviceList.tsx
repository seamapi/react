import { type ReactElement } from 'react'

import { useDevices } from 'lib/hooks/use-devices.js'
import { type Device } from 'lib/seam-client-stub.js'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeviceListProps {}

export const DeviceList = (_: DeviceListProps): ReactElement => {
  const { devices, isLoading, isError, error } = useDevices()

  if (isLoading) return <p>{i18nStub.loading}</p>
  if (isError) return <p>${error?.message}</p>

  return (
    <>
      {devices?.map((device) => (
        <DeviceListItem key={device.device_id} {...device} />
      ))}
    </>
  )
}

const DeviceListItem = (props: Device): ReactElement => {
  return <p>{props.device_id}</p>
}

const i18nStub = {
  loading: 'Loading devices',
  device_id: 'Device ID'
}
