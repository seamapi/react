import classNames from 'classnames'
import { useState } from 'react'
import type { ThermostatDevice } from 'seamapi'

import { BeeIcon } from 'lib/icons/Bee.js'
import { ChevronWideIcon } from 'lib/icons/ChevronWide.js'
import { ClimateSettingScheduleTable } from 'lib/seam/components/ClimateSettingScheduleTable/ClimateSettingScheduleTable.js'
import { useClimateSettingSchedules } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedules.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'
import { ThermostatCard } from 'lib/ui/thermostat/ThermostatCard.js'

import { useConnectedAccount } from '../../../../hooks.js'

export function ThermostatDeviceDetails(props: {
  device: ThermostatDevice
  onBack?: () => void
  className?: string
}): JSX.Element | null {
  const { device, onBack, className } = props

  const [climateSettingsOpen, setClimateSettingsOpen] = useState(false)

  const { connectedAccount } = useConnectedAccount(device.connected_account_id)

  const {
    climateSettingSchedules,
    isLoading: isLoadingClimateSchedules,
    isError: isErrorClimateSchedules,
  } = useClimateSettingSchedules({
    device_id: device.device_id,
  })

  const isClimateSchedulesPlural = climateSettingSchedules?.length !== 1

  if (climateSettingsOpen) {
    return (
      <ClimateSettingScheduleTable
        deviceId={device.device_id}
        onBack={() => { setClimateSettingsOpen(false); }}
      />
    )
  }

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
            >
              <DetailRow
                label={
                  isLoadingClimateSchedules || isErrorClimateSchedules
                    ? 'View scheduled climates'
                    : `${climateSettingSchedules?.length} ${
                        isClimateSchedulesPlural
                          ? t.climateSchedules
                          : t.climateSchedule
                      }`
                }
                onClick={() => { setClimateSettingsOpen(true); }}
              >
                <div className='seam-detail-row-rotated-icon'>
                  <ChevronWideIcon />
                </div>
              </DetailRow>
            </DetailSection>

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
                <div className='seam-detail-row-hstack'>
                  {device.properties.model.manufacturer_display_name}
                  <BeeIcon />
                </div>
              </DetailRow>
              <DetailRow
                label='Linked account'
                sublabel={
                  connectedAccount?.user_identifier?.email ??
                  device.connected_account_id
                }
              />
              <DetailRow label='Device ID' sublabel={device.device_id} />
            </DetailSection>
          </DetailSectionGroup>
        </div>
      </div>
    </div>
  )
}

const t = {
  climateSchedule: 'scheduled climate',
  climateSchedules: 'scheduled climates',
}
