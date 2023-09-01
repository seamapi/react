import classNames from 'classnames'
import type { ThermostatDevice } from 'seamapi'

import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'
import { ThermostatCard } from 'lib/ui/thermostat/ThermostatCard.js'

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
        <ThermostatCard device={device} />

        <div className='seam-thermostat-device-details'>
          <DetailSectionGroup>
            <DetailSection
              label='Scheduled climates'
              tooltipContent="Scheduled climates let you automatically change the thermostat's climate at a set time."
            />

            <DetailSection
              label='Current settings'
              tooltipContent='These are the settings currently on the device. If you change them here, they change ont he device.'
            >
              <DetailRow label='Climate'>
                <ClimateSettingStatus
                  climateSetting={device.properties.climate_setting}
                />
              </DetailRow>
            </DetailSection>
          </DetailSectionGroup>
        </div>
      </div>
    </div>
  )
}

const t = {}
