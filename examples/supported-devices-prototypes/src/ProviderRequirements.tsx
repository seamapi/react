import { RequirementIcon } from 'lib/seam/components/SupportedDevices/RequirementIcon.js'

import { AccessoryLinks } from './AccessoryCatalog.js'
import {
  getRequirementKinds,
  type RequirementKind,
  type ReviewDevice,
} from './model.js'
import { CheckMark } from './StatusMarks.js'

const columns: Array<{ kind: RequirementKind; label: string }> = [
  { kind: 'subscription', label: 'Subscription' },
  { kind: 'bridge', label: 'Bridge' },
  { kind: 'keypad', label: 'Keypad' },
]
const additionalColumns: typeof columns = [
  { kind: 'legal', label: 'Legal' },
  { kind: 'other', label: 'Other' },
]

export function ProviderRequirements({
  provider,
  view,
}: {
  provider: ReviewDevice['providers'][number]
  view: 'matrix' | 'list'
}): JSX.Element {
  if (provider.integrationStatus === 'unsupported')
    return (
      <a
        className='seam-proto-request-integration'
        href='https://www.seam.co/request-new-integration'
        target='_blank'
        rel='noopener noreferrer'
        aria-label={`Request Integration with ${provider.display_name ?? provider.slug} (opens in a new tab)`}
      >
        Request Integration <span aria-hidden>→</span>
      </a>
    )

  const visibleColumns = [
    ...columns,
    ...additionalColumns.filter(({ kind }) =>
      provider.requirements.some(({ message }) =>
        getRequirementKinds(message).includes(kind)
      )
    ),
  ]
  return (
    <>
      {provider.capabilities.length === 0 ? (
        <p className='seam-proto-provider-empty'>Capabilities not confirmed.</p>
      ) : view === 'matrix' ? (
        <div
          className='seam-proto-matrix-scroll'
          tabIndex={0}
          role='region'
          aria-label={`${provider.display_name ?? provider.slug} capability requirements`}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
              event.stopPropagation()
          }}
        >
          <table
            className='seam-proto-requirement-matrix'
            data-extra-columns={visibleColumns.length - columns.length}
          >
            <caption className='seam-compact-sr-only'>
              Supported capabilities and their additional requirements
            </caption>
            <thead>
              <tr>
                <th scope='col'>Capability</th>
                {visibleColumns.map(({ kind, label }) => (
                  <th scope='col' key={kind} aria-label={`${label} required`}>
                    <RequirementIcon message={kind} />
                    <span>{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {provider.capabilities.map((capability) => (
                <tr key={capability.name}>
                  <th scope='row'>{capability.label}</th>
                  {visibleColumns.map(({ kind, label }) => {
                    const required = capability.messages.some((message) =>
                      getRequirementKinds(message).includes(kind)
                    )
                    return (
                      <td key={kind}>
                        {required ? (
                          <span
                            className='seam-proto-matrix-required'
                            aria-label={`${label} required`}
                          >
                            <CheckMark />
                          </span>
                        ) : (
                          <span
                            className='seam-proto-matrix-none'
                            aria-label={`No ${label.toLowerCase()} requirement listed`}
                          >
                            —
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table className='seam-proto-capability-requirements'>
          <caption className='seam-compact-sr-only'>
            Supported capabilities and their additional requirements
          </caption>
          <colgroup>
            <col className='seam-proto-capability-name-column' />
            <col className='seam-proto-capability-supported-column' />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope='col'>Capability</th>
              <th scope='col' className='seam-proto-capability-support-cell'>
                Supported
              </th>
              <th scope='col'>Requirements</th>
            </tr>
          </thead>
          <tbody>
            {provider.capabilities.map((capability) => (
              <tr key={capability.name}>
                <th scope='row'>{capability.label}</th>
                <td className='seam-proto-capability-support-cell'>
                  <span
                    className='seam-proto-capability-supported'
                    role='img'
                    aria-label='Supported'
                  >
                    <CheckMark />
                  </span>
                </td>
                <td>
                  <div className='seam-proto-capability-pills'>
                    {visibleColumns
                      .filter(({ kind }) =>
                        capability.messages.some((message) =>
                          getRequirementKinds(message).includes(kind)
                        )
                      )
                      .map(({ kind, label }) => (
                        <span
                          className='seam-proto-inline-requirement'
                          key={kind}
                        >
                          <RequirementIcon message={kind} />
                          {label}
                        </span>
                      ))}
                    {capability.messages.length === 0 && (
                      <span
                        className='seam-proto-matrix-none'
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
      {view === 'matrix' && provider.capabilities.length > 0 && (
        <p className='seam-proto-matrix-legend'>
          <span>
            <CheckMark /> Required
          </span>
          <span>— No requirement listed</span>
        </p>
      )}
      {provider.requirements.length > 0 && (
        <ul
          className='seam-compact-requirements'
          aria-label='Requirement details'
        >
          {provider.requirements.map(({ message, deviceSlugs }) => (
            <li key={message}>
              <RequirementIcon message={message} />
              <div className='seam-proto-requirement-body'>
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
