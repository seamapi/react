import type { LockDevice } from 'seamapi'

const FALLBACK_IMAGE_URL =
  'https://connect.getseam.com/assets/images/devices/unknown-lock.png'

export function DeviceImage(props: { device: LockDevice }): JSX.Element {
  const { device } = props

  const url = device.properties.image_url ?? FALLBACK_IMAGE_URL

  return <img src={url} alt={device.properties.name} />
}
