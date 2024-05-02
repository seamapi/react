import type { HTMLAttributes } from 'react'
import type { CommonDevice } from 'seamapi'

export function DeviceImage(
  props: {
    device: CommonDevice
  } & HTMLAttributes<HTMLImageElement>
): JSX.Element {
  const { device, ...imageProps } = props

  const url = device.properties.image_url ?? fallbackImageUrl

  const optimizedSrc = `https://connect.getseam.com/_next/image?url=${encodeURIComponent(url)}&q=75&w=128`

  return <img src={optimizedSrc} alt={device.properties.name} {...imageProps} />
}

const fallbackImageUrl =
  'https://connect.getseam.com/assets/images/devices/unknown-lock.png'
