import { useState } from 'react'

import type { DeviceAsset } from 'lib/seam/ecosystem/types.js'

const logoKinds = [
  'square_logo',
  'horizontal_logo',
  'square_logo_mono',
  'horizontal_logo_mono',
] as const

export function BrandMark({
  name,
  logos,
  className = '',
}: {
  name: string
  logos?: DeviceAsset[]
  className?: string
}): JSX.Element {
  const logo = logoKinds
    .map((kind) => logos?.find((asset) => asset.kind === kind))
    .find((asset) => asset != null)
  const src = logo?.formats.small?.url ?? logo?.url
  const initial = name.slice(0, 1)
  return (
    <span
      className={`seam-supported-device-brand-mark ${className}`}
      aria-hidden
    >
      {src == null ? (
        <span>{initial}</span>
      ) : (
        <LogoImage key={src} src={src} initial={initial} />
      )}
    </span>
  )
}

function LogoImage({
  src,
  initial,
}: {
  src: string
  initial: string
}): JSX.Element {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <span>{initial}</span>
  ) : (
    <img
      src={src}
      alt=''
      width='24'
      height='24'
      onError={() => {
        setFailed(true)
      }}
    />
  )
}
