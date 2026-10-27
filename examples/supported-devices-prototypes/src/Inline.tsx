import type { VariantProps } from './model.js'
import { DeviceCard, RequirementList } from './shared.js'

export function Inline({ devices }: VariantProps): JSX.Element {
  return (
    <>
      {devices.map((device) => (
        <DeviceCard key={device.source.device_model_id} device={device}>
          <h4>Supported capabilities</h4>
          <ul className='seam-proto-inline-list'>
            {device.capabilities.map((capability) => (
              <li key={capability.name}>
                <strong>{capability.label}</strong>
                {capability.messages.length > 0 && (
                  <RequirementList messages={capability.messages} />
                )}
              </li>
            ))}
          </ul>
        </DeviceCard>
      ))}
    </>
  )
}
