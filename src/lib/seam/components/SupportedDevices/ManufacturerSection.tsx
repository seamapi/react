import { useState } from 'react'

import {
  getManufacturerLogoUrl,
  getManufacturerName,
  type ManufacturerGroup,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import { DeviceModelRow } from 'lib/seam/components/SupportedDevices/DeviceModelRow.js'
import type { Manufacturer } from 'lib/seam/ecosystem/types.js'

/** Device models shown per manufacturer before the show all button. */
const collapsedCount = 5

interface ManufacturerSectionProps {
  group: ManufacturerGroup
  manufacturer: Manufacturer | null
  collapsible: boolean
}

export function ManufacturerSection({
  group,
  manufacturer,
  collapsible,
}: ManufacturerSectionProps): JSX.Element {
  const [expanded, setExpanded] = useState(false)

  const { deviceModels } = group
  const canExpand = collapsible && deviceModels.length > collapsedCount
  const visibleDeviceModels =
    canExpand && !expanded
      ? deviceModels.slice(0, collapsedCount)
      : deviceModels

  const name =
    manufacturer != null
      ? getManufacturerName(manufacturer)
      : group.manufacturer != null
        ? getManufacturerName(group.manufacturer)
        : t.other

  const logoUrl = getManufacturerLogoUrl(manufacturer)

  return (
    <section className='seam-supported-devices-section'>
      <div className='seam-supported-devices-section-header'>
        <div className='seam-supported-devices-logo'>
          {logoUrl == null ? (
            <span aria-hidden>{name.slice(0, 1)}</span>
          ) : (
            <img loading='lazy' src={logoUrl} alt='' width={40} height={40} />
          )}
        </div>
        <h3 className='seam-supported-devices-section-title'>{name}</h3>
        <span className='seam-supported-devices-count'>
          {t.count(deviceModels.length)}
        </span>
      </div>
      <ul className='seam-supported-devices-rows'>
        {visibleDeviceModels.map((deviceModel) => (
          <DeviceModelRow
            key={deviceModel.device_model_id}
            deviceModel={deviceModel}
            manufacturer={manufacturer}
          />
        ))}
      </ul>
      {canExpand && (
        <div className='seam-supported-devices-section-footer'>
          <button
            type='button'
            className='seam-ecosystem-button'
            aria-expanded={expanded}
            onClick={() => {
              setExpanded((expanded) => !expanded)
            }}
          >
            {expanded ? t.showLess : t.showAll(name, deviceModels.length)}
          </button>
        </div>
      )}
    </section>
  )
}

const t = {
  other: 'Other devices',
  count: (count: number) => `${count} ${count === 1 ? 'device' : 'devices'}`,
  showAll: (name: string, count: number) => `Show all ${count} ${name} devices`,
  showLess: 'Show less',
}
