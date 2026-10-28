import type { DeviceModelSummary } from 'lib/seam/ecosystem/types.js'

import { HardwareGallery } from './HardwareGallery.js'
import type { ReviewDevice } from './model.js'

export function HardwareInformation({
  device,
}: {
  device: ReviewDevice
}): JSX.Element {
  const { source, name } = device
  const facts = hardwareFacts(source)
  return (
    <section className='seam-proto-hardware' aria-label='Hardware information'>
      <h3>Hardware information</h3>
      <HardwareGallery source={source} name={name} />
      <dl className='seam-proto-hardware-facts'>
        {facts.map(({ label, value }) => (
          <div
            key={label}
            className={
              label === 'Model numbers' ? 'seam-proto-model-numbers' : undefined
            }
          >
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className='seam-proto-hardware-links'>
        {source.manufacturer != null && (
          <a
            href={`https://www.seam.co/smartlocks/${source.manufacturer.slug}_${source.slug}`}
            target='_blank'
            rel='noreferrer'
          >
            Full device page ↗
          </a>
        )}
        {source.product_url != null && (
          <a href={source.product_url} target='_blank' rel='noreferrer'>
            Product page ↗
          </a>
        )}
      </div>
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
  if (numbers.length > 0)
    facts.push({ label: 'Model numbers', value: numbers.join(', ') })
  if (source.manufacturer != null)
    facts.push({
      label: 'Brand',
      value: source.manufacturer.display_name ?? source.manufacturer.slug,
    })
  const colors = [
    ...new Set(
      source.variants
        .map((variant) => variant.color_name)
        .filter((color): color is string => color != null && color !== '')
    ),
  ]
  if (colors.length > 0)
    facts.push({ label: 'Colors', value: colors.join(', ') })
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
  for (const [key, label] of [
    ['physical_key', 'Physical key'],
    ['is_battery_powered', 'Battery powered'],
  ] as const) {
    const value = properties[key]
    if (typeof value === 'boolean')
      facts.push({ label, value: value ? 'Yes' : 'No' })
  }
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
  return facts
}
