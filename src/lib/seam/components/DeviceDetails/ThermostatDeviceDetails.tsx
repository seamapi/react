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
        onBack={() => {
          setClimateSettingsOpen(false)
        }}
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
              label={t.scheduledClimates}
              tooltipContent={t.scheduledClimatesTooltip}
            >
              <DetailRow
                label={
                  isLoadingClimateSchedules || isErrorClimateSchedules
                    ? t.viewingClimateSchedules
                    : `${climateSettingSchedules?.length} ${
                        isClimateSchedulesPlural
                          ? t.climateSchedules
                          : t.climateSchedule
                      }`
                }
                onClick={() => {
                  setClimateSettingsOpen(true)
                }}
              >
                <div className='seam-detail-row-rotated-icon'>
                  <ChevronWideIcon />
                </div>
              </DetailRow>
            </DetailSection>

            <DetailSection
              label={t.currentSettings}
              tooltipContent={t.currentSettingsTooltip}
            >
              <DetailRow label={t.climate}>
                <ClimateSettingStatus
                  climateSetting={device.properties.current_climate_setting}
                  temperatureUnit='fahrenheit'
                />
              </DetailRow>
            </DetailSection>

            <DetailSection
              label={t.defaultSettings}
              tooltipContent={t.defaultSettingsTooltip}
            >
              <DetailRow label={t.defaultClimate}>
                {/* @ts-expect-error not currently included in sdk */}
                {device.properties.default_climate_setting != null ? (
                  <ClimateSettingStatus
                    climateSetting={device.properties.current_climate_setting}
                    temperatureUnit='fahrenheit'
                  />
                ) : (
                  <p>{t.none}</p>
                )}
              </DetailRow>
              <DetailRow label={t.allowManualOverride}>
                <p>
                  {device.properties.current_climate_setting
                    .manual_override_allowed
                    ? t.yes
                    : t.no}
                </p>
              </DetailRow>
            </DetailSection>

            <DetailSection
              label={t.deviceDetails}
              tooltipContent={t.deviceDetailsTooltip}
            >
              <DetailRow label={t.brand}>
                <div className='seam-detail-row-hstack'>
                  {device.properties.model.manufacturer_display_name}
                  {device.properties.model.manufacturer_display_name ===
                    'Ecobee' && <BeeIcon />}
                </div>
              </DetailRow>
              <DetailRow
                label={t.linkedAccount}
                sublabel={
                  connectedAccount?.user_identifier?.email ??
                  device.connected_account_id
                }
              />
              <DetailRow label={t.deviceId} sublabel={device.device_id} />
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
  viewingClimateSchedules: 'View scheduled climates',
  scheduledClimates: 'Scheduled climates',
  scheduledClimatesTooltip:
    "Scheduled climates let you automatically change the thermostat's climate at a set time.",
  currentSettings: 'Current settings',
  currentSettingsTooltip:
    'These are the settings currently on the device. If you change them here, they change ont he device.',
  climate: 'Climate',
  defaultSettings: 'Default settings',
  defaultSettingsTooltip:
    'When a scheduled climate reaches its end time, the default settings will kick in.',
  defaultClimate: 'Default climate',
  allowManualOverride: 'Allow manual override',
  deviceDetails: 'Device details',
  deviceDetailsTooltip:
    'When a scheduled climate reaches its end time, the default settings will kick in.',
  brand: 'Brand',
  linkedAccount: 'Linked account',
  deviceId: 'Device ID',
  none: 'None',
  yes: 'Yes',
  no: 'No',
}
