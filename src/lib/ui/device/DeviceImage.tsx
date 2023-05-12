import type { HTMLAttributes } from 'react'
import type { LockDevice } from 'seamapi'

export function DeviceImage(
  props: { device: LockDevice } & HTMLAttributes<HTMLImageElement>
): JSX.Element {
  const { device, ...imageProps } = props

  const url = device.properties.image_url ?? fallbackImageUrl

  return <img src={url} alt={device.properties.name} {...imageProps} />
}

const fallbackImageUrl =
  'https://connect.getseam.com/assets/images/devices/unknown-lock.png'
