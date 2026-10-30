import { BrandMark } from './BrandMark.js'
import { getDeviceModelImageUrl } from './device-models.js'
import { HardwareInformation } from './HardwareInformation.js'
import { getRequirementPills, type PresentedDevice } from './presentation.js'
import { ProviderRequirements } from './ProviderRequirements.js'
import { CheckMark, InfoMark } from './StatusMarks.js'

export function DeviceRow({
  device,
}: {
  device: PresentedDevice
}): JSX.Element {
  const image = getDeviceModelImageUrl(device.source)
  const pills = getRequirementPills(device)
  return (
    <details
      className={`seam-supported-device-row seam-supported-device-stacked${pills.length > 0 ? ' seam-supported-device-with-pills' : ''}`}
      aria-label={device.name}
    >
      <summary className='seam-supported-device-row-summary'>
        <span className='seam-supported-device-identity'>
          <span className='seam-supported-device-image'>
            {image == null ? (
              <span aria-hidden>{device.name.slice(0, 1)}</span>
            ) : (
              <img src={image} alt='' loading='lazy' width='44' height='44' />
            )}
          </span>
          <span className='seam-supported-device-identity-text'>
            <span className='seam-supported-device-name'>{device.name}</span>
            {device.source.capabilities_stale ? (
              <span className='seam-supported-device-status'>
                Compatibility is being refreshed.
              </span>
            ) : device.capabilities.length === 0 ? (
              <span className='seam-supported-device-status'>
                Compatibility not confirmed.
              </span>
            ) : (
              <span
                className='seam-supported-device-features'
                role='list'
                aria-label='Supported capabilities'
              >
                {device.capabilities.map((capability) => {
                  const conditional = capability.messages.length > 0
                  const status = conditional ? 'Requires setup' : 'Supported'
                  return (
                    <span role='listitem' key={capability.name}>
                      <span
                        className='seam-supported-device-feature seam-supported-device-status-feature'
                        data-conditional={conditional ? '' : undefined}
                        title={`${capability.label} · ${status}`}
                      >
                        {conditional ? <InfoMark /> : <CheckMark />}
                        <span>{capability.label}</span>
                        <span className='seam-supported-device-sr-only'>
                          {' '}
                          · {status}
                        </span>
                      </span>
                    </span>
                  )
                })}
              </span>
            )}
          </span>
        </span>
        <span className='seam-supported-device-pill-disclosure'>
          {pills.length > 0 ? (
            <span
              className='seam-supported-device-requirement-pills'
              role='list'
              aria-label='Additional requirements'
            >
              {pills.map((pill) => (
                <span
                  role='listitem'
                  key={pill.label}
                  className='seam-supported-device-requirement-pill'
                  title={pill.messages.join('\n')}
                >
                  {pill.label}
                </span>
              ))}
            </span>
          ) : (
            <span className='seam-supported-device-disclosure'>Details</span>
          )}
          <svg
            className='seam-supported-device-chevron'
            aria-hidden
            width='14'
            height='14'
            viewBox='0 0 20 20'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
          >
            <path
              d='m5 8 5 5 5-5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span className='seam-supported-device-sr-only'>
            Open requirements and model details
          </span>
        </span>
      </summary>
      <div className='seam-supported-device-expanded'>
        <HardwareInformation device={device} />
        <section
          className='seam-supported-device-providers'
          aria-label='Available providers'
        >
          <h4>Available providers</h4>
          <ul className='seam-supported-device-provider-list'>
            {device.providers.map((provider) => (
              <li
                className='seam-supported-device-provider'
                key={provider.provider_id}
                data-integration-status={provider.integrationStatus}
              >
                <div className='seam-supported-device-detail-heading'>
                  <BrandMark
                    className='seam-supported-device-provider-mark'
                    name={provider.display_name ?? provider.slug}
                    logos={provider.logos}
                  />
                  <div className='seam-supported-device-provider-name'>
                    <strong>{provider.display_name ?? provider.slug}</strong>
                    {provider.primary && <span>This guide</span>}
                    {provider.integrationStatus === 'unsupported' && (
                      <span>Not supported</span>
                    )}
                  </div>
                </div>
                <ProviderRequirements provider={provider} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </details>
  )
}

export function CapabilityLegend(): JSX.Element {
  return (
    <div
      className='seam-supported-device-legend'
      aria-label='Capability status legend'
    >
      <span>
        <CheckMark /> Supported
      </span>
      <span>
        <InfoMark /> Requires setup · open requirements
      </span>
    </div>
  )
}
