import type { HTMLAttributes } from 'react'
import type { CommonDevice } from 'seamapi'

export function DeviceImage(
  props: {
    device: CommonDevice
  } & HTMLAttributes<HTMLImageElement>
): JSX.Element {
  const { device, ...imageProps } = props

  const url = device.properties.image_url ?? fallbackImageUrl

  const relativePath = url.match(/assets\/(.*)$/)[1]
  const encoded = window.encodeURIComponent(relativePath)

  const w = 256

  const optimizedSrc = `https://connect.getseam.com/_next/image?url=${encoded}&w=${w}&q=75`

  return <img src={optimizedSrc} alt={device.properties.name} {...imageProps} />
}

const fallbackImageUrl =
  'https://connect.getseam.com/assets/images/devices/unknown-lock.png'
