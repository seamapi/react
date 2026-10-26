import classNames from 'classnames'

import {
  getCapabilityLabel,
  getDeviceModelImageUrl,
  getDeviceModelName,
  getSupportedCapabilities,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import type {
  DeviceModelSummary,
  Manufacturer,
} from 'lib/seam/ecosystem/types.js'

interface DeviceModelRowProps {
  deviceModel: DeviceModelSummary
  manufacturer: Manufacturer | null
}

export function DeviceModelRow({
  deviceModel,
  manufacturer,
}: DeviceModelRowProps): JSX.Element {
  const name = getDeviceModelName(deviceModel)
  const imageUrl = getDeviceModelImageUrl(deviceModel, manufacturer)
  const modelIds = [
    ...new Set(
      deviceModel.variants
        .map((v) => v.manufacturer_model_id)
        .filter((id): id is string => id != null && id.length > 0)
    ),
  ]
  const providers = deviceModel.providers
    .map((p) => p.display_name ?? p.slug)
    .join(', ')
  const capabilities = getSupportedCapabilities(deviceModel).filter(
    (c) => c.name !== 'device_connectivity'
  )
  const requirements = [
    ...new Set(
      capabilities.flatMap((capability) => [
        ...capability.requirements,
        ...(capability.supported === 'conditionally' &&
        capability.details != null
          ? [capability.details]
          : []),
      ])
    ),
  ]

  const meta = [
    modelIds.length > 0 ? modelIds.slice(0, 2).join(', ') : null,
    providers.length > 0 ? t.via(providers) : null,
  ].filter((value): value is string => value != null)

  return (
    <li className='seam-supported-devices-row'>
      <div className='seam-supported-devices-image'>
        {imageUrl == null ? (
          <span aria-hidden>{name.slice(0, 1)}</span>
        ) : (
          <img loading='lazy' src={imageUrl} alt='' width={48} height={48} />
        )}
      </div>
      <div className='seam-supported-devices-info'>
        {deviceModel.product_url == null ? (
          <span className='seam-supported-devices-name'>{name}</span>
        ) : (
          <a
            className='seam-supported-devices-name'
            href={deviceModel.product_url}
            target='_blank'
            rel='noopener noreferrer'
          >
            {name}
          </a>
        )}
        {meta.length > 0 && (
          <span className='seam-supported-devices-meta'>
            {meta.join(' · ')}
          </span>
        )}
      </div>
      <ul className='seam-supported-devices-badges' aria-label={t.badges}>
        {deviceModel.device_type != null && (
          <li className='seam-ecosystem-badge seam-ecosystem-badge-type'>
            {deviceModel.device_type.display_name}
          </li>
        )}
        {capabilities.map((capability) => (
          <li
            key={capability.name}
            className={classNames('seam-ecosystem-badge', {
              'seam-ecosystem-badge-conditional':
                capability.supported === 'conditionally',
            })}
            title={
              capability.supported === 'conditionally'
                ? [
                    ...capability.requirements,
                    capability.details ?? t.conditional,
                  ].join('\n')
                : undefined
            }
          >
            {getCapabilityLabel(capability.name)}
            {capability.integrationSupportLevel === 'beta' && ' (beta)'}
            {capability.supported === 'conditionally' && (
              <span className='seam-ecosystem-visually-hidden'>
                {` (${t.conditional})`}
              </span>
            )}
          </li>
        ))}
      </ul>
      {deviceModel.capabilities_stale ? (
        <span className='seam-supported-devices-status'>{t.refreshing}</span>
      ) : capabilities.length === 0 &&
        deviceModel.device_type?.is_accessory !== true ? (
        <span className='seam-supported-devices-status'>{t.unconfirmed}</span>
      ) : null}
      {requirements.length > 0 && (
        <details className='seam-supported-devices-requirements'>
          <summary>{t.requirements}</summary>
          <ul>
            {requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </details>
      )}
    </li>
  )
}

const t = {
  via: (providers: string) => `via ${providers}`,
  badges: 'Device type and capabilities',
  conditional: 'conditionally supported',
  requirements: 'Requirements and compatibility',
  refreshing: 'Compatibility is being refreshed.',
  unconfirmed: 'Compatibility not confirmed for this integration.',
}
