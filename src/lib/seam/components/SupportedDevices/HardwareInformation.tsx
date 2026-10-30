import type { DeviceModelSummary } from 'lib/seam/ecosystem/types.js'

import { HardwareGallery } from './HardwareGallery.js'
import type { PresentedDevice } from './presentation.js'

export function HardwareInformation({
  device,
}: {
  device: PresentedDevice
}): JSX.Element {
  const { source, name } = device
  const facts = hardwareFacts(source)
  return (
    <section
      className='seam-supported-device-hardware'
      aria-label='Hardware information'
    >
      <h4 className='seam-supported-device-sr-only'>Hardware information</h4>
      <dl className='seam-supported-device-hardware-facts'>
        {facts.map(({ label, value }) => (
          <div
            key={label}
            className={
              label === 'Model numbers'
                ? 'seam-supported-device-model-numbers'
                : undefined
            }
          >
            <dt>
              {label}
              {label === 'Model numbers' && source.manufacturer != null && (
                <a
                  href={`https://www.seam.co/${encodeURIComponent(source.device_type?.slug ?? 'smartlock')}s/${encodeURIComponent(source.manufacturer.slug)}_${encodeURIComponent(source.slug)}`}
                  target='_blank'
                  rel='noreferrer'
                  aria-label='Full device page'
                  title='Full device page'
                >
                  ↗
                </a>
              )}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div className='seam-supported-device-hardware-colors'>
          <dt>Colors</dt>
          <dd>
            <HardwareGallery source={source} name={name} />
          </dd>
        </div>
      </dl>
    </section>
  )
}

function hardwareFacts(
  source: DeviceModelSummary
): Array<{ label: string; value: string }> {
  const facts: Array<{ label: string; value: string }> = []
  const numbers = [
    ...new Set(
      source.variants
        .map((variant) => variant.manufacturer_model_id)
        .filter((id): id is string => id != null && id !== '')
    ),
  ]
  facts.push({
    label: 'Model numbers',
    value: numbers.length > 0 ? numbers.join(', ') : 'Not listed',
  })
  const properties =
    typeof source.device_type_properties === 'object' &&
    source.device_type_properties != null
      ? (source.device_type_properties as Record<string, unknown>)
      : {}
  const lockType = properties['lock_type']
  if (typeof lockType === 'string' && lockType !== '')
    facts.push({
      label: 'Lock type',
      value:
        lockType.charAt(0).toUpperCase() +
        lockType.slice(1).replaceAll('_', ' '),
    })
  const batteryType = properties['battery_type']
  const batteryCount = properties['battery_count']
  if (typeof batteryType === 'string' && batteryType !== '')
    facts.push({
      label: 'Batteries',
      value:
        typeof batteryCount === 'number' && batteryCount > 0
          ? `${batteryCount} × ${batteryType}`
          : batteryType,
    })
  else if (typeof properties['is_battery_powered'] === 'boolean')
    facts.push({
      label: 'Power',
      value: properties['is_battery_powered']
        ? 'Battery powered'
        : 'Not battery powered',
    })
  return facts
}
