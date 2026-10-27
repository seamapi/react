import type { VariantProps } from './model.js'
import { DeviceHeading, ModelDetails, RequirementList } from './shared.js'

export function Table({ devices }: VariantProps): JSX.Element {
  const capabilities = [
    ...new Map(
      devices.flatMap((device) =>
        device.capabilities.map(
          (capability) => [capability.name, capability.label] as const
        )
      )
    ),
  ]
  return (
    <div
      className='seam-proto-table-scroll'
      tabIndex={0}
      aria-label='Compare capabilities by model'
    >
      <table className='seam-proto-table'>
        <caption>Capabilities and requirements by model</caption>
        <thead>
          <tr>
            <th scope='col'>Device</th>
            {capabilities.map(([name, label]) => (
              <th scope='col' key={name}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.source.device_model_id}>
              <th scope='row'>
                <DeviceHeading device={device} />
                <ModelDetails device={device} />
              </th>
              {capabilities.map(([name]) => {
                const capability = device.capabilities.find(
                  (item) => item.name === name
                )
                return (
                  <td key={name}>
                    {capability == null ? (
                      <span className='seam-proto-muted'>
                        Not listed as supported
                      </span>
                    ) : (
                      <>
                        <span className='seam-proto-supported'>
                          Supported
                          {capability.label.includes('(beta)') ? ' (beta)' : ''}
                        </span>
                        {capability.messages.length > 0 && (
                          <RequirementList messages={capability.messages} />
                        )}
                      </>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
