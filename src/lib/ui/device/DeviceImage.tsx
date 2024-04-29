import type { HTMLAttributes } from 'react'
import type { CommonDevice } from 'seamapi'

export function DeviceImage(
  props: {
    device: CommonDevice
  } & HTMLAttributes<HTMLImageElement>
): JSX.Element {
  const { device, ...imageProps } = props

  const optimizedSrc = `https://connect.getseam.com/_next/image?url=http%3A%2F%2Flocalhost%3A3020%2Finternal%2Fdevicedb_image_proxy%3Fimage_id%3D00e70527-3f8a-4631-ac11-c24e541e0fa5&q=75&w=128`

  return <img src={optimizedSrc} alt={device.properties.name} {...imageProps} />
}
