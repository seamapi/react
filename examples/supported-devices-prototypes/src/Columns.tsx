import type { CSSProperties } from 'react'

import { getCapabilityLabel } from 'lib/seam/components/SupportedDevices/device-models.js'

import type { VariantProps } from './model.js'
import { CompactRow, DeviceIdentity, Feature } from './shared.js'

export function Columns({ devices }: VariantProps): JSX.Element {
  const names = [
    ...new Set(
      devices.flatMap((device) =>
        device.capabilities.map((capability) => capability.name)
      )
    ),
  ]
  const style: CSSProperties & { '--seam-compact-column-count': number } = {
    '--seam-compact-column-count': names.length,
  }
  return (
    <div className='seam-compact-list seam-compact-columns-list' style={style}>
      <div className='seam-compact-column-heading' aria-hidden>
        <span>Device</span>
        <span className='seam-compact-column-labels'>
          {names.map((name) => (
            <span key={name}>{getCapabilityLabel(name)}</span>
          ))}
        </span>
        <span />
      </div>
      {devices.map((device) => (
        <CompactRow
          key={device.source.device_model_id}
          device={device}
          layout='columns'
        >
          <DeviceIdentity device={device} />
          <span
            className='seam-compact-column-cells'
            role='list'
            aria-label='Supported capabilities'
          >
            {names.map((name) => {
              const capability = device.capabilities.find(
                (item) => item.name === name
              )
              return (
                <span
                  key={name}
                  className='seam-compact-column-cell'
                  role='listitem'
                >
                  {capability == null ? (
                    <span
                      title={`${getCapabilityLabel(name)}: not listed as supported`}
                    >
                      <span aria-hidden>—</span>
                      <span className='seam-compact-sr-only'>
                        {getCapabilityLabel(name)}: not listed as supported
                      </span>
                    </span>
                  ) : (
                    <Feature capability={capability} iconOnly />
                  )}
                </span>
              )
            })}
          </span>
        </CompactRow>
      ))}
    </div>
  )
}
