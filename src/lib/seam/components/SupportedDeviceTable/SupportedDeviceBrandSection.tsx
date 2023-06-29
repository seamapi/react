import classNames from 'classnames'
import type { DeviceModel } from 'seamapi'

import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { HiddenDevicesOverlay } from 'lib/seam/components/SupportedDeviceTable/HiddenDevicesOverlay.js'
import { ShowAllDevicesButton } from 'lib/seam/components/SupportedDeviceTable/ShowAllDevicesButton.js'
import { SupportedDeviceRow } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceRow.js'
import { useDeviceProvider } from 'lib/seam/components/SupportedDeviceTable/use-device-provider.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * How many device models required before we collapse
 * the list, and require the user to click to
 * view all.
 */
const maxDevicesBeforeCollapsing = 3

export interface SupportedDeviceBrandSectionProps {
  brand: string
  deviceModels: DeviceModel[]
}

export function SupportedDeviceBrandSection({
  brand,
  deviceModels,
}: SupportedDeviceBrandSectionProps): JSX.Element | null {
  const deviceProvider = useDeviceProvider(brand)

  const [expanded, toggleExpand] = useToggle()

  const canExpand = deviceModels.length > maxDevicesBeforeCollapsing

  const visibleDevices = () => {
    if (!canExpand || expanded) {
      return deviceModels
    }

    return deviceModels.filter(
      (_deviceModel, index) => index < maxDevicesBeforeCollapsing
    )
  }

  const handleHeaderClick = () => {
    if (!canExpand) {
      return
    }

    toggleExpand()
  }

  return (
    <div
      className={classNames('seam-brand-section', {
        'can-expand': canExpand,
        expanded,
      })}
    >
      <div className='seam-header' onClick={handleHeaderClick}>
        <img
          src={deviceProvider.image_url}
          alt={brand}
          className='seam-brand-image'
        />
        <h5 className='seam-brand-name'>
          {deviceProvider.display_name} {t.devices}
        </h5>
        {canExpand && <ChevronRightIcon className='chevron' />}
      </div>
      <div className='seam-supported-device-table-content'>
        {visibleDevices().map((deviceModel, index) => (
          <SupportedDeviceRow
            key={[
              deviceModel.main_category,
              deviceModel.brand,
              deviceModel.model_name,
              deviceModel.manufacturer_model_id,
              index,
            ].join(':')}
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

const t = {
  devices: 'Devices',
}
