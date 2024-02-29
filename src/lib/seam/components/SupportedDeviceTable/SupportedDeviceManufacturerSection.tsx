import type {
  DeviceModel,
  ManufacturerAnnotation,
} from '@seamapi/types/devicedb'
import classNames from 'classnames'

import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { InfoBlueIcon } from 'lib/icons/InfoBlue.js'
import { HiddenDevicesOverlay } from 'lib/seam/components/SupportedDeviceTable/HiddenDevicesOverlay.js'
import { ShowAllDevicesButton } from 'lib/seam/components/SupportedDeviceTable/ShowAllDevicesButton.js'
import { SupportedDeviceRow } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceRow.js'
import { useManufacturer } from 'lib/seam/components/SupportedDeviceTable/use-manufacturer.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * How many device models required before collapsing the list,
 * and requiring the user to click to view all.
 */
const maxDevicesBeforeCollapsing = 3

interface SupportedDeviceManufacturerSectionProps {
  manufacturerId: string
  deviceModels: DeviceModel[]
}

export function SupportedDeviceManufacturerSection({
  manufacturerId,
  deviceModels,
}: SupportedDeviceManufacturerSectionProps): JSX.Element | null {
  const { manufacturer } = useManufacturer({ manufacturer_id: manufacturerId })

  const [expanded, toggleExpand] = useToggle()

  const canExpand = deviceModels.length > maxDevicesBeforeCollapsing

  const visibleDevices =
    !canExpand || expanded
      ? deviceModels
      : deviceModels.filter(
          (_deviceModel, index) => index < maxDevicesBeforeCollapsing
        )

  const handleHeaderClick = (): void => {
    if (!canExpand) {
      return
    }

    toggleExpand()
  }

  return (
    <div
      className={classNames('seam-manufacturer-section', {
        'can-expand': canExpand,
        expanded,
      })}
    >
      <div className='seam-header' onClick={handleHeaderClick}>
        <img
          src={manufacturer?.logo?.url}
          alt={manufacturer?.display_name}
          className='seam-manufacturer-image'
        />
        <h5 className='seam-manufacturer-name'>
          {manufacturer?.display_name} {t.devices}
        </h5>
        {canExpand && <ChevronRightIcon className='chevron' />}
      </div>
      {manufacturer?.annotations.map((annotation, idx) => (
        <ManufacturerAnnotationBox
          key={[annotation.annotation_code, idx].join('_')}
          annotation={annotation}
        />
      ))}
      <div className='seam-supported-device-table-content'>
        {visibleDevices.map((deviceModel) => (
          <SupportedDeviceRow
            key={deviceModel.device_model_id}
            deviceModel={deviceModel}
          />
        ))}
      </div>
      <ShowAllDevicesButton
        visible={canExpand}
        onClick={toggleExpand}
        expanded={expanded}
        totalDeviceCount={deviceModels.length}
      />
      <HiddenDevicesOverlay visible={canExpand && !expanded} />
    </div>
  )
}

function ManufacturerAnnotationBox({
  annotation,
}: {
  annotation: ManufacturerAnnotation
}): JSX.Element {
  return (
    <div className='seam-manufacturer-annotation-box'>
      <InfoBlueIcon />
      <p className='seam-annotation'>{annotation.message}</p>
    </div>
  )
}

const t = {
  devices: 'Devices',
}
