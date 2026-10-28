import type { VariantProps } from './model.js'
import { CompactRow, DeviceIdentity, Features } from './shared.js'

export function RequirementPills({
  devices,
  requirementView,
}: VariantProps): JSX.Element {
  return (
    <div className='seam-compact-list'>
      <div className='seam-compact-list-heading'>
        <span>Device & supported capabilities</span>
      </div>
      {devices.map((device) => (
        <CompactRow
          key={device.source.device_model_id}
          device={device}
          layout='stacked'
          requirementView={requirementView}
          showRequirementPills
        >
          <DeviceIdentity device={device} showType={false}>
            <Features device={device} statusIcons />
          </DeviceIdentity>
        </CompactRow>
      ))}
    </div>
  )
}
