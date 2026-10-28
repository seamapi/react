import type { VariantProps } from './model.js'
import { CompactRow, DeviceIdentity, Features } from './shared.js'

export function Chips({ devices }: VariantProps): JSX.Element {
  return (
    <div className='seam-compact-list'>
      <div className='seam-compact-list-heading'>
        <span>Device</span>
        <span>Supported capabilities</span>
      </div>
      {devices.map((device) => (
        <CompactRow
          key={device.source.device_model_id}
          device={device}
          layout='chips'
        >
          <DeviceIdentity device={device} />
          <Features device={device} />
        </CompactRow>
      ))}
    </div>
  )
}
