import type { PropsWithChildren } from 'react'

import { getDeviceModelImageUrl } from 'lib/seam/components/SupportedDevices/device-models.js'
import { RequirementIcon } from 'lib/seam/components/SupportedDevices/RequirementIcon.js'

import type { ReviewDevice } from './model.js'

export function DeviceHeading({
  device,
}: {
  device: ReviewDevice
}): JSX.Element {
  const image = getDeviceModelImageUrl(device.source, null)
  return (
    <header className='seam-proto-device-heading'>
      <span className='seam-proto-image'>
        {image != null && (
          <img src={image} alt='' width='44' height='44' loading='lazy' />
        )}
      </span>
      <div>
        <h3>{device.name}</h3>
        {device.source.capabilities_stale ? (
          <p className='seam-proto-muted'>Compatibility is being refreshed.</p>
        ) : device.capabilities.length === 0 ? (
          <p className='seam-proto-muted'>
            Compatibility not confirmed for this integration.
          </p>
        ) : null}
      </div>
    </header>
  )
}

export function DeviceCard({
  device,
  children,
}: PropsWithChildren<{ device: ReviewDevice }>): JSX.Element {
  return (
    <article className='seam-proto-device' aria-label={device.name}>
      <DeviceHeading device={device} />
      <div className='seam-proto-device-body'>
        {children}
        <ModelDetails device={device} />
      </div>
    </article>
  )
}

export function ModelDetails({
  device,
}: {
  device: ReviewDevice
}): JSX.Element {
  const modelIds = [
    ...new Set(
      device.source.variants
        .map((variant) => variant.manufacturer_model_id)
        .filter((id) => id != null && id.length > 0)
    ),
  ]
  return (
    <details className='seam-proto-model-details'>
      <summary>Model details</summary>
      <dl>
        {modelIds.length > 0 && (
          <>
            <dt>Model numbers</dt>
            <dd>{modelIds.join(', ')}</dd>
          </>
        )}
        <dt>Integration</dt>
        <dd>
          {device.source.providers
            .map((provider) => provider.display_name ?? provider.slug)
            .join(', ')}
        </dd>
      </dl>
      {device.source.product_url != null && (
        <a href={device.source.product_url} target='_blank' rel='noreferrer'>
          Manufacturer’s product page ↗
        </a>
      )}
    </details>
  )
}

export function RequirementList({
  messages,
}: {
  messages: string[]
}): JSX.Element {
  return (
    <ul className='seam-proto-requirement-list'>
      {messages.map((message) => (
        <li key={message}>
          <RequirementIcon message={message} />
          <span>{message}</span>
        </li>
      ))}
    </ul>
  )
}
