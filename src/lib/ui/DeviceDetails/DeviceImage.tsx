import type { LockDevice } from 'seamapi'

export function DeviceImage(props: { device: LockDevice }): JSX.Element {
  const { device } = props

  const url = device.properties.image_url ?? fallbackImageUrl

  return <img src={url} alt={device.properties.name} />
}

const fallbackImageUrl =
  'https://connect.getseam.com/assets/images/devices/unknown-lock.png'
