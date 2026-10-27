import { requirementSummary, type VariantProps } from './model.js'
import { DeviceCard, RequirementList } from './shared.js'

export function Expand({ devices }: VariantProps): JSX.Element {
  return (
    <>
      {devices.map((device) => (
        <DeviceCard key={device.source.device_model_id} device={device}>
          <h4>Supported capabilities</h4>
          <div className='seam-proto-expand-list'>
            {device.capabilities.map((capability) =>
              capability.messages.length > 0 ? (
                <details
                  key={capability.name}
                  className='seam-proto-capability-details'
                >
                  <summary>
                    <span>
                      <strong>{capability.label}</strong>
                      <span className='seam-proto-muted'>
                        {requirementSummary(capability)}
                      </span>
                    </span>
                  </summary>
                  <RequirementList messages={capability.messages} />
                </details>
              ) : (
                <div className='seam-proto-unconditional' key={capability.name}>
                  <strong>{capability.label}</strong>
                  <span className='seam-proto-muted'>Supported</span>
                </div>
              )
            )}
          </div>
        </DeviceCard>
      ))}
    </>
  )
}
