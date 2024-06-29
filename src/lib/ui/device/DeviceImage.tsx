import type { Device } from '@seamapi/types/connect'
import type { HTMLAttributes } from 'react'

export function DeviceImage(
  props: {
    device: Device
  } & HTMLAttributes<HTMLImageElement>
): JSX.Element {
  const { device, ...imageProps } = props

  const url = device.properties.image_url ?? fallbackImageUrl

  return <img src={url} alt={device.properties.name} {...imageProps} />
}

const fallbackImageUrl =
  'https://connect.getseam.com/assets/images/devices/unknown-lock.png'
