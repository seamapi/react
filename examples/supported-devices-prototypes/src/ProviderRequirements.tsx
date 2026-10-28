import { RequirementIcon } from 'lib/seam/components/SupportedDevices/RequirementIcon.js'

import {
  getRequirementKind,
  type RequirementKind,
  type ReviewDevice,
} from './model.js'
import { CheckMark } from './StatusMarks.js'

const columns: Array<{ kind: RequirementKind; label: string }> = [
  { kind: 'subscription', label: 'Subscription' },
  { kind: 'bridge', label: 'Bridge' },
  { kind: 'keypad', label: 'Keypad' },
]

export function ProviderRequirements({
  provider,
  view,
}: {
  provider: ReviewDevice['providers'][number]
  view: 'matrix' | 'list'
}): JSX.Element {
  const visibleColumns = provider.requirements.some(
    ({ message }) => getRequirementKind(message) === 'other'
  )
    ? [...columns, { kind: 'other' as const, label: 'Other' }]
    : columns
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
            data-has-other={visibleColumns.length > 3 ? '' : undefined}
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
                    const required = capability.messages.some(
                      (message) => getRequirementKind(message) === kind
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
          <thead>
            <tr>
              <th scope='col'>Capability</th>
              <th scope='col'>Requirements</th>
            </tr>
          </thead>
          <tbody>
            {provider.capabilities.map((capability) => (
              <tr key={capability.name}>
                <th scope='row'>{capability.label}</th>
                <td>
                  <div className='seam-proto-capability-pills'>
                    {visibleColumns
                      .filter(({ kind }) =>
                        capability.messages.some(
                          (message) => getRequirementKind(message) === kind
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
                      <span className='seam-proto-matrix-none'>
                        None listed
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
          {provider.requirements.map(({ message }) => (
            <li key={message}>
              <RequirementIcon message={message} />
              <p>{message}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
