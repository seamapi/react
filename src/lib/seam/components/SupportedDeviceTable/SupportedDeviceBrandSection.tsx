import classNames from 'classnames'
import type { DeviceModel } from 'seamapi'

import { getBrandInfo, getImage } from 'lib/brands.js'
import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { HiddenDevicesOverlay } from 'lib/seam/components/SupportedDeviceTable/HiddenDevicesOverlay.js'
import { ShowAllDevicesButton } from 'lib/seam/components/SupportedDeviceTable/ShowAllDevicesButton.js'
import { SupportedDeviceRow } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceRow.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * How many device models before requiring the
 * user to expand the list.
 */
const numDevicesBeforeHiding = 3

export interface SupportedDeviceRowProps {
  brand: string
  deviceModels: DeviceModel[]
}

export function SupportedDeviceBrandSection({
  brand,
  deviceModels,
}: SupportedDeviceRowProps): JSX.Element {
  const brandInfo = getBrandInfo(brand)

  const [collapsed, toggleCollapsed] = useToggle()
  const [viewingAllDevices, toggleViewingAllDevices] = useToggle()

  const canToggleDevices = deviceModels.length > numDevicesBeforeHiding

  const visibleDevices = () => {
    if (!canToggleDevices || viewingAllDevices) {
      return deviceModels
    }

    return deviceModels.filter(
      (_deviceModel, index) => index < numDevicesBeforeHiding
    )
  }

  return (
    <div
      className={classNames('seam-brand-section', {
        collapsed,
        'viewing-all-devices': viewingAllDevices,
      })}
    >
      <div className='seam-header' onClick={toggleCollapsed}>
        <img
          src={getImage(brandInfo)}
          alt={brand}
          className='seam-brand-image'
        />
        <h5 className='seam-brand-name'>
          {brandInfo.readableName} {t.devices}
        </h5>
        <ChevronRightIcon className='chevron' />
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
        isShowing={canToggleDevices && !collapsed}
        onClick={toggleViewingAllDevices}
        viewingAllDevices={viewingAllDevices}
        totalDeviceCount={deviceModels.length}
      />
      <HiddenDevicesOverlay
        isShowing={canToggleDevices && !viewingAllDevices && !collapsed}
      />
    </div>
  )
}

const t = {
  devices: 'Devices',
}
