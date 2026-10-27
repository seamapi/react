import { CheckIcon } from 'lib/icons/Check.js'
import { TriangleWarningOutlineIcon } from 'lib/icons/TriangleWarningOutline.js'
import {
  getCapabilityLabel,
  getCapabilityRequirementMessages,
  getDeviceModelImageUrl,
  getDeviceModelName,
  getSupportedCapabilities,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import { RequirementIcon } from 'lib/seam/components/SupportedDevices/RequirementIcon.js'
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
  const providers = deviceModel.providers.map((p) => p.display_name ?? p.slug)
  const capabilities = getSupportedCapabilities(deviceModel).filter(
    (c) => c.name !== 'device_connectivity'
  )
  const requirements = new Map<string, Set<string>>()
  for (const capability of capabilities) {
    const messages = getCapabilityRequirementMessages(capability)
    for (const message of messages) {
      const features = requirements.get(message) ?? new Set<string>()
      features.add(getCapabilityLabel(capability.name))
      requirements.set(message, features)
    }
  }

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
        {deviceModel.device_type != null && (
          <span className='seam-supported-devices-meta'>
            {deviceModel.device_type.display_name}
          </span>
        )}
      </div>
      {capabilities.length > 0 && (
        <ul className='seam-supported-devices-features' aria-label={t.features}>
          {capabilities.map((capability) => (
            <li key={capability.name}>
              {capability.supported === 'conditionally' ? (
                <TriangleWarningOutlineIcon
                  aria-hidden
                  className='seam-supported-devices-conditional-icon'
                />
              ) : (
                <CheckIcon aria-hidden />
              )}
              <span>
                {getCapabilityLabel(capability.name)}
                {capability.integrationSupportLevel === 'beta' && ' (beta)'}
                {capability.supported === 'conditionally' && (
                  <span className='seam-ecosystem-visually-hidden'>
                    {` (${t.requirementsBelow})`}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      {deviceModel.capabilities_stale ? (
        <span className='seam-supported-devices-status'>{t.refreshing}</span>
      ) : capabilities.length === 0 &&
        deviceModel.device_type?.is_accessory !== true ? (
        <span className='seam-supported-devices-status'>{t.unconfirmed}</span>
      ) : null}
      {requirements.size > 0 && (
        <ul
          className='seam-supported-devices-requirements'
          aria-label={t.requirements}
        >
          {[...requirements].map(([message, features]) => (
            <li key={message}>
              <RequirementIcon message={message} />
              <div>
                <span>{message}</span>
                <span className='seam-supported-devices-requirement-features'>
                  {t.requiredFor([...features].join(', '))}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {(modelIds.length > 0 || providers.length > 0) && (
        <details className='seam-supported-devices-details'>
          <summary>{t.modelDetails}</summary>
          <dl>
            {modelIds.length > 0 && (
              <div>
                <dt>{t.modelNumbers}</dt>
                <dd>{modelIds.join(', ')}</dd>
              </div>
            )}
            {providers.length > 0 && (
              <div>
                <dt>{t.integration}</dt>
                <dd>{providers.join(', ')}</dd>
              </div>
            )}
          </dl>
        </details>
      )}
    </li>
  )
}

const t = {
  features: 'Supported features',
  requirements: 'Requirements',
  requirementsBelow: 'see requirements below',
  requiredFor: (features: string) => `For ${features}`,
  modelDetails: 'Model details',
  modelNumbers: 'Model numbers',
  integration: 'Integration',
  refreshing: 'Compatibility is being refreshed.',
  unconfirmed: 'Compatibility not confirmed for this integration.',
}
