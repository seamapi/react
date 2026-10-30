import { useState } from 'react'

import { getManufacturerName } from 'lib/seam/components/SupportedDevices/device-models.js'
import type { Manufacturer } from 'lib/seam/ecosystem/types.js'

import { BrandMark } from './BrandMark.js'
import { DeviceRow } from './DeviceRow.js'
import type { PresentedDevice } from './presentation.js'

/** Device models shown per manufacturer before the show all button. */
const collapsedCount = 5

interface ManufacturerSectionProps {
  devices: PresentedDevice[]
  manufacturer: Manufacturer | null
  collapsible: boolean
}

export function ManufacturerSection({
  devices,
  manufacturer,
  collapsible,
}: ManufacturerSectionProps): JSX.Element {
  const [expanded, setExpanded] = useState(false)

  const canExpand = collapsible && devices.length > collapsedCount
  const visibleDeviceModels =
    canExpand && !expanded ? devices.slice(0, collapsedCount) : devices

  const name =
    manufacturer != null
      ? getManufacturerName(manufacturer)
      : devices[0]?.source.manufacturer != null
        ? getManufacturerName(devices[0].source.manufacturer)
        : t.other

  return (
    <section className='seam-supported-devices-section'>
      <div className='seam-supported-devices-section-header'>
        <BrandMark name={name} logos={manufacturer?.logos} />
        <h3 className='seam-supported-devices-section-title'>{name}</h3>
        <span className='seam-supported-devices-count'>
          {t.count(devices.length)}
        </span>
      </div>
      <div className='seam-supported-device-list'>
        <div className='seam-supported-device-list-heading'>
          Device & supported capabilities
        </div>
        {visibleDeviceModels.map((deviceModel) => (
          <DeviceRow
            key={deviceModel.source.device_model_id}
            device={deviceModel}
          />
        ))}
      </div>
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
            {expanded ? t.showLess : t.showAll(name, devices.length)}
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
