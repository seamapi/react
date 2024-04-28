import type { HTMLAttributes } from 'react'
import type { CommonDevice } from 'seamapi'

export function DeviceImage(
  props: {
    device: CommonDevice
  } & HTMLAttributes<HTMLImageElement>
): JSX.Element {
  const { device, ...imageProps } = props

  const url = device.properties.image_url ?? fallbackImageUrl

  const dbUrl =
    'https://connect.getseam.com/internal/devicedb_image_proxy?image_id=92907fd0-a3d9-4cc8-9076-b743696d9259'

  const relativePath = url.match(/assets\/(.*)$/)[1]
  const encoded = window.encodeURIComponent(dbUrl)

  const w = 128

  const optimizedSrc = `http://localhost:3020/_next/image?url=${encoded}&w=${w}&q=75`

  return <img src={optimizedSrc} alt={device.properties.name} {...imageProps} />
}

const fallbackImageUrl =
  'https://connect.getseam.com/assets/images/devices/unknown-lock.png'
