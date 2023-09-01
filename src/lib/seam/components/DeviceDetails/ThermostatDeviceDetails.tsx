import classNames from 'classnames'
import type { ThermostatDevice } from 'seamapi'

import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { ThermostatCard } from 'lib/ui/thermostat/ThermostatCard.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'

export function ThermostatDeviceDetails(props: {
  device: ThermostatDevice
  onBack?: () => void
  className?: string
}): JSX.Element | null {
  const { device, onBack, className } = props

  if (device == null) {
    return null
  }

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
            ></DetailSection>

            <DetailSection
              label='Current settings'
              tooltipContent='These are the settings currently on the device. If you change them here, they change ont he device.'
            >
              <DetailRow label='Climate'>
                <ClimateSettingStatus
                  climateSetting={device.properties.current_climate_setting}
                  temperatureUnit='fahrenheit'
                />
              </DetailRow>
              <DetailRow label='Fan mode'>
                {device.properties.current_fan_mode}
              </DetailRow>
            </DetailSection>

            <DetailSection
              label='Default settings'
              tooltipContent='When a scheduled climate reaches its end time, the default settings will kick in.'
            >
              <DetailRow label='Default climate'>
                {device.properties.default_climate_setting != null ? (
                  <ClimateSettingStatus
                    climateSetting={device.properties.current_climate_setting}
                    temperatureUnit='fahrenheit'
                  />
                ) : (
                  <p>None</p>
                )}
              </DetailRow>
              <DetailRow label='Allow manual override'>
                <p>
                  {device.properties.current_climate_setting
                    .manual_override_allowed
                    ? 'Yes'
                    : 'No'}
                </p>
              </DetailRow>
            </DetailSection>

            <DetailSection
              label='Device details'
              tooltipContent='When a scheduled climate reaches its end time, the default settings will kick in.'
            >
              <DetailRow label='Brand'>
                {device.properties.model.manufacturer_display_name}
              </DetailRow>
            </DetailSection>
          </DetailSectionGroup>
        </div>
      </div>
    </div>
  )
}

const t = {}
