import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { debounce } from 'lib/debounce.js'
import { CheckBlackIcon } from 'lib/icons/CheckBlack.js'
import type { NestedSpecificDeviceDetailsProps } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { DeviceInfo } from 'lib/seam/components/DeviceDetails/DeviceInfo.js'
import type {
  HvacModeSetting,
  ThermostatDevice,
} from 'lib/seam/thermostats/thermostat-device.js'
import { useCoolThermostat } from 'lib/seam/thermostats/use-cool-thermostat.js'
import { useHeatCoolThermostat } from 'lib/seam/thermostats/use-heat-cool-thermostat.js'
import { useHeatThermostat } from 'lib/seam/thermostats/use-heat-thermostat.js'
import { useSetThermostatFanMode } from 'lib/seam/thermostats/use-set-thermostat-fan-mode.js'
import { useSetThermostatOff } from 'lib/seam/thermostats/use-set-thermostat-off.js'
import { AccordionRow } from 'lib/ui/layout/AccordionRow.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'
import { Snackbar } from 'lib/ui/Snackbar/Snackbar.js'
import { ClimateModeMenu } from 'lib/ui/thermostat/ClimateModeMenu.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'
import { FanModeMenu } from 'lib/ui/thermostat/FanModeMenu.js'
import { TemperatureControlGroup } from 'lib/ui/thermostat/TemperatureControlGroup.js'
import { ThermostatCard } from 'lib/ui/thermostat/ThermostatCard.js'

interface ThermostatDeviceDetailsProps
  extends NestedSpecificDeviceDetailsProps {
  device: ThermostatDevice
  onEditName?: (newName: string) => void
}

export function ThermostatDeviceDetails({
  device,
  disableResourceIds,
  disableConnectedAccountInformation,
  onBack,
  className,
  onEditName,
}: ThermostatDeviceDetailsProps): JSX.Element | null {
  if (device == null) {
    return null
  }

  return (
    <div className={classNames('seam-device-details', className)}>
      <ContentHeader title={t.thermostat} onBack={onBack} />

      <div className='seam-body'>
        <ThermostatCard device={device} onEditName={onEditName} />

        <div className='seam-thermostat-device-details'>
          <DetailSectionGroup>
            <DetailSection
              label={t.currentSettings}
              tooltipContent={t.currentSettingsTooltip}
            >
              <ClimateSettingRow device={device} />
              <FanModeRow device={device} />
            </DetailSection>

            <DeviceInfo
              device={device}
              disableConnectedAccountInformation={
                disableConnectedAccountInformation
              }
              disableResourceIds={disableResourceIds}
            />
          </DetailSectionGroup>
        </div>
      </div>
    </div>
  )
}

function FanModeRow({ device }: { device: ThermostatDevice }): JSX.Element {
  const { mutate, isSuccess, isError } = useSetThermostatFanMode()

  return (
    <>
      <div className='seam-detail-row-wrap'>
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
      </div>

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
  const deviceHeatValue =
    device.properties.current_climate_setting.heating_set_point_fahrenheit
  const deviceCoolValue =
    device.properties.current_climate_setting.cooling_set_point_fahrenheit

  const availableHvacModes = device.properties.available_hvac_mode_settings

  const [showSuccess, setShowSuccess] = useState(false)
  const [mode, setMode] = useState<HvacModeSetting>(
    (availableHvacModes.includes('heat_cool')
      ? 'heat_cool'
      : availableHvacModes[0]) ?? 'off'
  )

  const [heatValue, setHeatValue] = useState(
    device.properties.current_climate_setting.heating_set_point_fahrenheit ?? 0
  )

  const [coolValue, setCoolValue] = useState(
    device.properties.current_climate_setting.cooling_set_point_fahrenheit ?? 0
  )

  const {
    mutate: heatCoolThermostat,
    isSuccess: isHeatCoolSuccess,
    isError: isHeatCoolError,
  } = useHeatCoolThermostat()

  const {
    mutate: heatThermostat,
    isSuccess: isHeatSuccess,
    isError: isHeatError,
  } = useHeatThermostat()

  const {
    mutate: coolThermostat,
    isSuccess: isCoolSuccess,
    isError: isCoolError,
  } = useCoolThermostat()

  const {
    mutate: setThermostatOff,
    isSuccess: isSetOffSuccess,
    isError: isSetOffError,
  } = useSetThermostatOff()

  useEffect(() => {
    const handler = debounce(() => {
      switch (mode) {
        case 'heat_cool':
          heatCoolThermostat({
            device_id: device.device_id,
            heating_set_point_fahrenheit: heatValue,
            cooling_set_point_fahrenheit: coolValue,
          })
          break
        case 'heat':
          heatThermostat({
            device_id: device.device_id,
            heating_set_point_fahrenheit: heatValue,
          })
          break
        case 'cool':
          coolThermostat({
            device_id: device.device_id,
            cooling_set_point_fahrenheit: coolValue,
          })
          break
        case 'off':
          setThermostatOff({
            device_id: device.device_id,
          })
          break
      }
    }, 2000)

    if (
      heatValue !== deviceHeatValue ||
      coolValue !== deviceCoolValue ||
      mode === 'off'
    ) {
      handler()
    }

    return () => {
      handler.cancel()
    }
  }, [
    heatValue,
    coolValue,
    mode,
    deviceHeatValue,
    deviceCoolValue,
    device,
    heatThermostat,
    coolThermostat,
    heatCoolThermostat,
    setThermostatOff,
  ])

  useEffect(() => {
    if (
      isHeatCoolSuccess ||
      isHeatSuccess ||
      isCoolSuccess ||
      isSetOffSuccess
    ) {
      setShowSuccess(true)

      const timeout = globalThis.setTimeout(() => {
        setShowSuccess(false)
      }, 3000)

      return () => {
        globalThis.clearTimeout(timeout)
      }
    }

    return () => {}
  }, [isHeatCoolSuccess, isHeatSuccess, isCoolSuccess, isSetOffSuccess])

  return (
    <>
      <AccordionRow
        label={t.climate}
        leftContent={
          <div
            className={classNames('seam-thermostat-mutation-status', {
              'is-visible': showSuccess,
            })}
          >
            <div className='seam-thermostat-mutation-status-icon'>
              <CheckBlackIcon />
            </div>
            <div className='seam-thermostat-mutation-status-label'>
              {t.saved}
            </div>
          </div>
        }
        rightCollapsedContent={
          <ClimateSettingStatus
            climateSetting={device.properties.current_climate_setting}
            temperatureUnit='fahrenheit'
            iconPlacement='right'
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
              delta={
                Number(
                  'min_heating_cooling_delta_fahrenheit' in device.properties &&
                    device.properties.min_heating_cooling_delta_fahrenheit
                ) ?? 0
              }
            />
          )}

          <ClimateModeMenu
            mode={mode}
            onChange={setMode}
            supportedModes={availableHvacModes}
          />
        </div>
      </AccordionRow>

      <Snackbar
        message={t.climateSettingError}
        variant='error'
        visible={isHeatCoolError || isHeatError || isCoolError || isSetOffError}
        automaticVisibility
      />
    </>
  )
}

const t = {
  thermostat: 'Thermostat',
  currentSettings: 'Current settings',
  currentSettingsTooltip:
    'These are the settings currently on the device. If you change them here, they change on the device.',
  climate: 'Climate',
  fanMode: 'Fan mode',
  none: 'None',
  fanModeSuccess: 'Successfully updated fan mode!',
  fanModeError: 'Error updating fan mode. Please try again.',
  climateSettingError: 'Error updating climate setting. Please try again.',
  saved: 'Saved',
}
