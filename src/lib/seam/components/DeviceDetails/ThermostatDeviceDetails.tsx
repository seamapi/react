import classNames from 'classnames'
import { useEffect, useState } from 'react'
import type { HvacModeSetting, ThermostatDevice } from 'seamapi'

import { debounce } from 'lib/debounce.js'
import { BeeIcon } from 'lib/icons/Bee.js'
import { ChevronWideIcon } from 'lib/icons/ChevronWide.js'
import { NestedClimateSettingScheduleTable } from 'lib/seam/components/ClimateSettingScheduleTable/ClimateSettingScheduleTable.js'
import type { CommonProps } from 'lib/seam/components/common-props.js'
import { useConnectedAccount } from 'lib/seam/connected-accounts/use-connected-account.js'
import { useClimateSettingSchedules } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedules.js'
import { useUpdateFanMode } from 'lib/seam/thermostats/use-update-fan-mode.js'
import { useUpdateThermostat } from 'lib/seam/thermostats/use-update-thermostat.js'
import { AccordionRow } from 'lib/ui/layout/AccordionRow.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'
import { Snackbar } from 'lib/ui/Snackbar/Snackbar.js'
import { Switch } from 'lib/ui/Switch/Switch.js'
import { ClimateModeMenu } from 'lib/ui/thermostat/ClimateModeMenu.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'
import { FanModeMenu } from 'lib/ui/thermostat/FanModeMenu.js'
import { TemperatureControlGroup } from 'lib/ui/thermostat/TemperatureControlGroup.js'
import { ThermostatCard } from 'lib/ui/thermostat/ThermostatCard.js'

interface ThermostatDeviceDetailsProps extends CommonProps {
  device: ThermostatDevice
}

export function ThermostatDeviceDetails({
  device,
  onBack,
  className,
  errorFilter = () => true,
  warningFilter = () => true,
  disableLockUnlock,
  disableCreateAccessCode,
  disableEditAccessCode,
  disableDeleteAccessCode,
  disableResourceIds = false,
}: ThermostatDeviceDetailsProps): JSX.Element | null {
  const [climateSettingsOpen, setClimateSettingsOpen] = useState(false)

  const { connectedAccount } = useConnectedAccount(device.connected_account_id)

  const { climateSettingSchedules } = useClimateSettingSchedules({
    device_id: device.device_id,
  })

  if (climateSettingsOpen) {
    return (
      <NestedClimateSettingScheduleTable
        deviceId={device.device_id}
        errorFilter={errorFilter}
        warningFilter={warningFilter}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        disableResourceIds={disableResourceIds}
        onBack={() => {
          setClimateSettingsOpen(false)
        }}
        className={className}
      />
    )
  }

  if (device == null) {
    return null
  }

  const climateSettingSchedulesLabel =
    climateSettingSchedules?.length !== 1
      ? t.climateSchedules
      : t.climateSchedule

  return (
    <div className={classNames('seam-device-details', className)}>
      <ContentHeader title={t.thermostat} onBack={onBack} />

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
                  climateSettingSchedules == null
                    ? t.viewingClimateSchedules
                    : `${climateSettingSchedules.length} ${climateSettingSchedulesLabel}`
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
              <ClimateSettingRow device={device} />
              <FanModeRow device={device} />
            </DetailSection>

            <DetailSection
              label={t.defaultSettings}
              tooltipContent={t.defaultSettingsTooltip}
            >
              <DetailRow label={t.defaultClimate}>
                {device.properties.default_climate_setting != null ? (
                  <ClimateSettingStatus
                    climateSetting={device.properties.default_climate_setting}
                    temperatureUnit='fahrenheit'
                  />
                ) : (
                  <p>{t.none}</p>
                )}
              </DetailRow>

              <ManualOverrideRow device={device} />
            </DetailSection>

            <DetailSection label={t.deviceDetails}>
              <DetailRow label={t.manufacturer}>
                <div className='seam-detail-row-hstack'>
                  {device.properties.model.manufacturer_display_name}
                  {device.properties.manufacturer === 'ecobee' && <BeeIcon />}
                </div>
              </DetailRow>
              <DetailRow
                label={t.linkedAccount}
                sublabel={
                  connectedAccount?.user_identifier?.email ??
                  device.connected_account_id
                }
              />
              {!disableResourceIds && (
                <DetailRow label={t.deviceId} sublabel={device.device_id} />
              )}
            </DetailSection>
          </DetailSectionGroup>
        </div>
      </div>
    </div>
  )
}

function ManualOverrideRow({
  device,
}: {
  device: ThermostatDevice
}): JSX.Element {
  const { mutate, isSuccess, isError } = useUpdateThermostat()

  return (
    <>
      <DetailRow label={t.allowManualOverride}>
        <Switch
          checked={
            device.properties.default_climate_setting
              ?.manual_override_allowed ?? true
          }
          onChange={(checked) => {
            mutate({
              device_id: device.device_id,
              default_climate_setting: {
                manual_override_allowed: checked,
              },
            })
          }}
        />
      </DetailRow>
      <Snackbar
        message={t.manualOverrideSuccess}
        variant='success'
        visible={isSuccess}
        automaticVisibility
      />

      <Snackbar
        message={t.manualOverrideError}
        variant='error'
        visible={isError}
        automaticVisibility
      />
    </>
  )
}

function FanModeRow({ device }: { device: ThermostatDevice }): JSX.Element {
  const { mutate, isSuccess, isError } = useUpdateFanMode()

  return (
    <>
      <DetailRow label={t.fanMode}>
        <FanModeMenu
          mode={device.properties.fan_mode_setting}
          onChange={(fanMode) => {
            mutate({
              device_id: device.device_id,
              fan_mode_setting: fanMode,
            })
          }}
        />
      </DetailRow>

      <Snackbar
        message={t.fanModeSuccess}
        variant='success'
        visible={isSuccess}
        automaticVisibility
        autoDismiss
      />

      <Snackbar
        message={t.fanModeError}
        variant='error'
        visible={isError}
        automaticVisibility
      />
    </>
  )
}

function ClimateSettingRow({
  device,
}: {
  device: ThermostatDevice
}): JSX.Element {
  const [mode, setMode] = useState<HvacModeSetting>('heat_cool')

  const [heatValue, setHeatValue] = useState(
    device.properties.current_climate_setting.heating_set_point_fahrenheit ?? 0
  )

  const [coolValue, setCoolValue] = useState(
    device.properties.current_climate_setting.cooling_set_point_fahrenheit ?? 0
  )

  // const {
  //   mutate: heatCoolThermostat,
  //   isSuccess: isHeatCoolSuccess,
  //   isError: isHeatCoolError,
  // } = useHeatCoolThermostat()

  // const {
  //   mutate: heatThermostat,
  //   isSuccess: isHeatSuccess,
  //   isError: isHeatError,
  // } = useHeatThermostat()

  // const {
  //   mutate: coolThermostat,
  //   isSuccess: isCoolSuccess,
  //   isError: isCoolError,
  // } = useCoolThermostat()

  // const {
  //   mutate: setThermostatOff,
  //   isSuccess: isSetOffSuccess,
  //   isError: isSetOffError,
  // } = useSetThermostatOff()

  useEffect(() => {
    const handler = debounce((heatValue, coolValue) => {
      console.log({ heatValue, coolValue })
    }, 1000)

    if (heatValue && coolValue) {
      handler(heatValue, coolValue)
    }

    return () => {
      handler.cancel()
    }
  }, [heatValue, coolValue])

  return (
    <AccordionRow
      label={t.climate}
      rightCollapsedContent={
        <ClimateSettingStatus
          climateSetting={device.properties.current_climate_setting}
          temperatureUnit='fahrenheit'
        />
      }
    >
      <div className='seam-detail-row-end-alignment'>
        {mode !== 'off' && (
          <TemperatureControlGroup
            mode={mode}
            heatValue={heatValue}
            coolValue={coolValue}
            onHeatValueChange={setHeatValue}
            onCoolValueChange={setCoolValue}
          />
        )}

        <ClimateModeMenu mode={mode} onChange={setMode} />
      </div>
    </AccordionRow>
  )
}

const t = {
  thermostat: 'Thermostat',
  climateSchedule: 'scheduled climate',
  climateSchedules: 'scheduled climates',
  viewingClimateSchedules: 'View scheduled climates',
  scheduledClimates: 'Scheduled climates',
  scheduledClimatesTooltip:
    "Scheduled climates let you automatically change the thermostat's climate at a set time.",
  currentSettings: 'Current settings',
  currentSettingsTooltip:
    'These are the settings currently on the device. If you change them here, they change on the device.',
  climate: 'Climate',
  fanMode: 'Fan mode',
  defaultSettings: 'Default settings',
  defaultSettingsTooltip:
    'When a scheduled climate reaches its end time, the default settings will kick in.',
  defaultClimate: 'Default climate',
  allowManualOverride: 'Allow manual override',
  deviceDetails: 'Device details',
  manufacturer: 'Manufacturer',
  linkedAccount: 'Linked account',
  deviceId: 'Device ID',
  none: 'None',
  fanModeSuccess: 'Successfully updated fan mode!',
  fanModeError: 'Error updating fan mode. Please try again.',
  manualOverrideSuccess: 'Successfully updated manual override!',
  manualOverrideError: 'Error updating manual override. Please try again.',
}
