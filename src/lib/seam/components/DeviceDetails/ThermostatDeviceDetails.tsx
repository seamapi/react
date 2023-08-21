import classNames from 'classnames'
import type { ThermostatDevice } from 'seamapi'

import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

export function ThermostatDeviceDetails(props: {
  device: ThermostatDevice
  onBack?: () => void
  className?: string
}): JSX.Element | null {
  const { device, onBack, className } = props

  return (
    <div className={classNames('seam-device-details', className)}>
      <ContentHeader title='Thermostat' onBack={onBack} />
      <div className='seam-body'>
        {/* ThermostatCard */}

        <div className='seam-thermostat-details-sections'>
          <div className='seam-thermostat-detail-section'>
            <div className='seam-thermostat-detail-label-wrap'>
              <p className='seam-thermostat-detail-label'>Current settings</p>
              {/* Info button */}
            </div>

            <div className='seam-thermostat-detail-group'>
              <div className='seam-thermostat-detail-row'>
                <p className='seam-thermostat-row-title'>Climate</p>
              </div>
              <div className='seam-thermostat-detail-row'>
                <p className='seam-thermostat-row-title'>Fan mode</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const t = {}
