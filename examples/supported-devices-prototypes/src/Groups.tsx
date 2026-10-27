import { RequirementIcon } from 'lib/seam/components/SupportedDevices/RequirementIcon.js'

import { requirementLabel, type VariantProps } from './model.js'
import { DeviceCard } from './shared.js'

export function Groups({ devices }: VariantProps): JSX.Element {
  return (
    <>
      {devices.map((device) => (
        <DeviceCard key={device.source.device_model_id} device={device}>
          <h4>Supported capabilities</h4>
          <ul className='seam-proto-capability-bullets'>
            {device.capabilities.map((capability) => (
              <li key={capability.name}>{capability.label}</li>
            ))}
          </ul>
          {device.requirements.length > 0 && (
            <section
              className='seam-proto-groups'
              aria-label='What you’ll need'
            >
              <h4>What you’ll need</h4>
              {device.requirements.map((requirement) => (
                <div
                  key={requirement.message}
                  className='seam-proto-requirement-group'
                >
                  <RequirementIcon message={requirement.message} />
                  <div>
                    <strong>{requirementLabel(requirement.message)}</strong>
                    <p>{requirement.message}</p>
                    <span className='seam-proto-muted'>
                      For {requirement.capabilities.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </section>
          )}
        </DeviceCard>
      ))}
    </>
  )
}
