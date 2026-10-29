import type { PropsWithChildren } from 'react'

import { getDeviceModelImageUrl } from 'lib/seam/components/SupportedDevices/device-models.js'

import { BrandMark } from './BrandMark.js'
import { HardwareInformation } from './HardwareInformation.js'
import {
  type Capability,
  getRequirementPills,
  type ReviewDevice,
} from './model.js'
import { ProviderRequirements } from './ProviderRequirements.js'
import { CheckMark, InfoMark } from './StatusMarks.js'

export function CapabilityIcon({ name }: { name: string }): JSX.Element {
  return (
    <svg
      aria-hidden
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      {name.includes('plastic_cards') ? (
        <>
          <rect x='3' y='5' width='18' height='14' rx='2' />
          <path d='M3 9h18M7 14h4' />
        </>
      ) : name.includes('access_codes') ? (
        <>
          <rect x='5' y='2' width='14' height='20' rx='3' />
          <path d='M9 6h6M9 10h.01M12 10h.01M15 10h.01M9 14h.01M12 14h.01M15 14h.01M12 18h.01' />
        </>
      ) : name.includes('unlock') ? (
        <>
          <rect x='5' y='10' width='14' height='11' rx='2' />
          <path d='M9 10V6a4 4 0 0 1 7-2.6M12 14v3' />
        </>
      ) : name.includes('lock') ? (
        <>
          <rect x='5' y='10' width='14' height='11' rx='2' />
          <path d='M8 10V6a4 4 0 0 1 8 0v4M12 14v3' />
        </>
      ) : (
        <>
          <circle cx='12' cy='12' r='9' />
          <path d='m8 12 3 3 5-6' />
        </>
      )}
    </svg>
  )
}

export function Feature({
  capability,
  iconOnly = false,
  statusIcons = false,
}: {
  capability: Capability
  iconOnly?: boolean
  statusIcons?: boolean
}): JSX.Element {
  const status = capability.messages.length > 0 ? 'Requires setup' : 'Supported'
  return (
    <span
      className={`seam-compact-feature${iconOnly ? ' seam-compact-feature-icon-only' : ''}${statusIcons ? ' seam-compact-status-feature' : ''}`}
      data-conditional={capability.messages.length > 0 ? '' : undefined}
      title={`${capability.label} · ${status}`}
    >
      {statusIcons ? (
        capability.messages.length > 0 ? (
          <InfoMark />
        ) : (
          <CheckMark />
        )
      ) : (
        <CapabilityIcon name={capability.name} />
      )}
      <span className={iconOnly ? 'seam-compact-icon-label' : undefined}>
        {capability.label}
      </span>
      <span className='seam-compact-sr-only'> · {status}</span>
    </span>
  )
}

export function Features({
  device,
  statusIcons = false,
}: {
  device: ReviewDevice
  statusIcons?: boolean
}): JSX.Element {
  return (
    <span
      className='seam-compact-features'
      role='list'
      aria-label='Supported capabilities'
    >
      {device.capabilities.map((capability) => (
        <span role='listitem' key={capability.name}>
          <Feature capability={capability} statusIcons={statusIcons} />
        </span>
      ))}
    </span>
  )
}

export function DeviceIdentity({
  device,
  children,
  showType = true,
}: PropsWithChildren<{
  device: ReviewDevice
  showType?: boolean
}>): JSX.Element {
  const image = getDeviceModelImageUrl(device.source, null)
  return (
    <span className='seam-compact-identity'>
      <span className='seam-compact-image'>
        {image == null ? (
          <span aria-hidden>{device.name.slice(0, 1)}</span>
        ) : (
          <img src={image} alt='' loading='lazy' width='44' height='44' />
        )}
      </span>
      <span className='seam-compact-identity-text'>
        {showType && (
          <span className='seam-compact-device-type'>
            {device.source.device_type?.display_name ?? 'Device'}
          </span>
        )}
        <span className='seam-compact-device-name'>{device.name}</span>
        {device.source.capabilities_stale ? (
          <span className='seam-compact-device-status'>
            Compatibility is being refreshed.
          </span>
        ) : device.capabilities.length === 0 ? (
          <span className='seam-compact-device-status'>
            Compatibility not confirmed.
          </span>
        ) : null}
        {children}
      </span>
    </span>
  )
}

export function CompactRow({
  device,
  layout,
  children,
  showRequirementPills = false,
  requirementView = 'list',
}: PropsWithChildren<{
  device: ReviewDevice
  layout: string
  showRequirementPills?: boolean
  requirementView?: 'matrix' | 'list'
}>): JSX.Element {
  const conditional = device.requirements.length > 0
  return (
    <details
      className={`seam-compact-row seam-compact-${layout}${showRequirementPills && conditional ? ' seam-compact-with-pills' : ''}`}
      aria-label={device.name}
    >
      <summary className='seam-compact-row-summary'>
        {children}
        {showRequirementPills && conditional ? (
          <PillDisclosure device={device} />
        ) : (
          <span
            className='seam-compact-disclosure'
            data-conditional={conditional ? '' : undefined}
          >
            {conditional && <InfoMark />}
            <span>{conditional ? 'Requirements' : 'Details'}</span>
            <svg
              className='seam-compact-chevron'
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
          </span>
        )}
      </summary>
      <ExpandedDetails device={device} requirementView={requirementView} />
    </details>
  )
}

function PillDisclosure({ device }: { device: ReviewDevice }): JSX.Element {
  return (
    <span className='seam-compact-pill-disclosure'>
      <span
        className='seam-compact-requirement-pills'
        role='list'
        aria-label='Additional requirements'
      >
        {getRequirementPills(device).map((pill) => (
          <span
            role='listitem'
            key={pill.label}
            className='seam-compact-requirement-pill'
            title={pill.messages.join('\n')}
          >
            {pill.label}
          </span>
        ))}
      </span>
      <svg
        className='seam-compact-chevron'
        aria-hidden
        width='14'
        height='14'
        viewBox='0 0 20 20'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      >
        <path d='m5 8 5 5 5-5' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
      <span className='seam-compact-sr-only'>
        Open requirements and model details
      </span>
    </span>
  )
}

function ExpandedDetails({
  device,
  requirementView,
}: {
  device: ReviewDevice
  requirementView: 'matrix' | 'list'
}): JSX.Element {
  return (
    <div className='seam-compact-expanded'>
      <HardwareInformation device={device} />
      <section
        className='seam-proto-providers'
        aria-label='Available providers'
      >
        <h3>Available providers</h3>
        <ul className='seam-proto-provider-list'>
          {device.providers.map((provider) => (
            <li className='seam-proto-provider' key={provider.provider_id}>
              <div className='seam-compact-detail-heading'>
                <BrandMark
                  className='seam-compact-provider-mark'
                  name={provider.display_name ?? provider.slug}
                  logos={provider.logos}
                />
                <div className='seam-proto-provider-name'>
                  <strong>{provider.display_name ?? provider.slug}</strong>
                  {provider.primary && <span>This guide</span>}
                </div>
              </div>
              <ProviderRequirements
                provider={provider}
                view={requirementView}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export function Legend(): JSX.Element {
  return (
    <div className='seam-compact-legend' aria-label='Capability status legend'>
      <span>
        <svg
          aria-hidden
          width='14'
          height='14'
          viewBox='0 0 20 20'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.7'
        >
          <path
            d='m4 10 4 4 8-8'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        Supported
      </span>
      <span>
        <InfoMark />
        Requires setup · open requirements
      </span>
    </div>
  )
}
