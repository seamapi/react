import { AccessoryLinks } from './AccessoryCatalog.js'
import {
  getRequirementKinds,
  type PresentedDevice,
  type RequirementKind,
} from './presentation.js'
import { RequirementIcon } from './RequirementIcon.js'
import { CheckMark } from './StatusMarks.js'

const columns: Array<{ kind: RequirementKind; label: string }> = [
  { kind: 'subscription', label: 'Subscription' },
  { kind: 'bridge', label: 'Bridge' },
  { kind: 'keypad', label: 'Keypad' },
  { kind: 'legal', label: 'Legal' },
  { kind: 'other', label: 'Other' },
]

export function ProviderRequirements({
  provider,
}: {
  provider: PresentedDevice['providers'][number]
}): JSX.Element {
  if (provider.integrationStatus === 'unsupported')
    return (
      <a
        className='seam-supported-device-request-integration'
        href='https://www.seam.co/request-new-integration'
        target='_blank'
        rel='noopener noreferrer'
        aria-label={`Request Integration with ${provider.display_name ?? provider.slug} (opens in a new tab)`}
      >
        Request Integration <span aria-hidden>→</span>
      </a>
    )
  return (
    <>
      {provider.capabilities.length === 0 ? (
        <p className='seam-supported-device-provider-empty'>
          Capabilities not confirmed.
        </p>
      ) : (
        <table className='seam-supported-device-capability-requirements'>
          <caption className='seam-supported-device-sr-only'>
            Supported capabilities and their additional requirements
          </caption>
          <colgroup>
            <col className='seam-supported-device-capability-name-column' />
            <col className='seam-supported-device-capability-supported-column' />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope='col'>Capability</th>
              <th
                scope='col'
                className='seam-supported-device-capability-support-cell'
              >
                Supported
              </th>
              <th scope='col'>Requirements</th>
            </tr>
          </thead>
          <tbody>
            {provider.capabilities.map((capability) => (
              <tr key={capability.name}>
                <th scope='row'>{capability.label}</th>
                <td className='seam-supported-device-capability-support-cell'>
                  <span
                    className='seam-supported-device-capability-supported'
                    role='img'
                    aria-label='Supported'
                  >
                    <CheckMark />
                  </span>
                </td>
                <td>
                  <div className='seam-supported-device-capability-pills'>
                    {columns
                      .filter(({ kind }) =>
                        capability.messages.some((message) =>
                          getRequirementKinds(message).includes(kind)
                        )
                      )
                      .map(({ kind, label }) => (
                        <span
                          className='seam-supported-device-inline-requirement'
                          key={kind}
                        >
                          <RequirementIcon message={kind} />
                          {label}
                        </span>
                      ))}
                    {capability.messages.length === 0 && (
                      <span
                        className='seam-supported-device-no-requirements'
                        role='img'
                        aria-label='No additional requirements listed'
                      >
                        —
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {provider.requirements.length > 0 && (
        <ul
          className='seam-supported-device-requirements'
          aria-label='Requirement details'
        >
          {provider.requirements.map(({ message, deviceSlugs }) => (
            <li key={message}>
              <RequirementIcon message={message} />
              <div className='seam-supported-device-requirement-body'>
                <p>{message}</p>
                <AccessoryLinks message={message} slugs={deviceSlugs} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
