import { useId } from 'react'

import type { ReviewDevice, VariantProps } from './model.js'
import { DeviceCard } from './shared.js'

export function Notes({ devices }: VariantProps): JSX.Element {
  return (
    <>
      {devices.map((device) => (
        <NoteDevice key={device.source.device_model_id} device={device} />
      ))}
    </>
  )
}

function NoteDevice({ device }: { device: ReviewDevice }): JSX.Element {
  const id = useId()
  return (
    <DeviceCard device={device}>
      <h4>Supported capabilities</h4>
      <ul className='seam-proto-note-capabilities'>
        {device.capabilities.map((capability) => (
          <li key={capability.name}>
            {capability.label}
            {capability.messages.map((message) => {
              const index = device.requirements.findIndex(
                (requirement) => requirement.message === message
              )
              return (
                <a
                  key={message}
                  href={`#${id}-${index}`}
                  className='seam-proto-note-ref'
                  aria-label={`${capability.label}: requirement ${index + 1}, ${message}`}
                >
                  {index + 1}
                </a>
              )
            })}
          </li>
        ))}
      </ul>
      {device.requirements.length > 0 && (
        <div className='seam-proto-notes'>
          <h4>What you’ll need</h4>
          <ol>
            {device.requirements.map((requirement, index) => (
              <li key={requirement.message} id={`${id}-${index}`} tabIndex={-1}>
                {requirement.message}
              </li>
            ))}
          </ol>
        </div>
      )}
    </DeviceCard>
  )
}
