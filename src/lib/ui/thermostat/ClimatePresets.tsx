import classNames from 'classnames'
import { type HTMLAttributes, type ReactNode, useMemo, useState } from 'react'

import { AddIcon } from 'lib/icons/Add.js'
import { EditIcon } from 'lib/icons/Edit.js'
import { FanIcon } from 'lib/icons/Fan.js'
import { ThermostatCoolIcon } from 'lib/icons/ThermostatCool.js'
import { ThermostatHeatIcon } from 'lib/icons/ThermostatHeat.js'
import { TrashIcon } from 'lib/icons/Trash.js'
import type {
  ThermostatClimatePreset,
  ThermostatDevice,
} from 'lib/seam/thermostats/thermostat-device.js'
import { getTemperatureUnitSymbol } from 'lib/seam/thermostats/unit-conversion.js'
import { useDeleteThermostatClimatePreset } from 'lib/seam/thermostats/use-delete-thermostat-climate-preset.js'
import { Button } from 'lib/ui/Button.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { Popover } from 'lib/ui/Popover/Popover.js'
import { PopoverContentPrompt } from 'lib/ui/Popover/PopoverContentPrompt.js'
import { Snackbar } from 'lib/ui/Snackbar/Snackbar.js'
import { Spinner } from 'lib/ui/Spinner/Spinner.js'
import { ClimatePreset } from 'lib/ui/thermostat/ClimatePreset.js'

interface ClimatePresetsManagement {
  device: ThermostatDevice
  onBack: () => void
  temperatureUnit: 'fahrenheit' | 'celsius'
}

const CreateNewPresetSymbol = Symbol('CreateNewPreset')

const DeleteClimatePresetErrorCodes = {
  ClimatePresetNotFound: 'climate_preset_not_found',
  DeviceNotFound: 'device_not_found',
  ClimatePresetIsScheduled: 'climate_preset_is_scheduled',
}

export function ClimatePresets(props: ClimatePresetsManagement): JSX.Element {
  const { device, onBack } = props

  const [selectedClimatePreset, setSelectedClimatePreset] = useState<
    ThermostatClimatePreset | typeof CreateNewPresetSymbol | null
  >(null)

  const [
    climatePresetKeySelectedForDeletion,
    setClimatePresetKeySelectedForDeletion,
  ] = useState<ThermostatClimatePreset['climate_preset_key'] | null>(null)

  const { mutate, isError, error, isPending } =
    useDeleteThermostatClimatePreset()

  const errorMessage = useMemo(() => {
    if (!isError) return ''

    if (error?.code === DeleteClimatePresetErrorCodes.ClimatePresetNotFound) {
      return t.climatePresetNotFound
    }

    if (error?.code === DeleteClimatePresetErrorCodes.DeviceNotFound) {
      return t.deviceNotFound
    }

    if (
      error?.code === DeleteClimatePresetErrorCodes.ClimatePresetIsScheduled
    ) {
      return t.climatePresetIsScheduled
    }

    return t.unknownErrorOccured
  }, [error, isError])

  if (
    selectedClimatePreset != null ||
    selectedClimatePreset === CreateNewPresetSymbol
  ) {
    return (
      <ClimatePreset
        onBack={() => {
          setSelectedClimatePreset(null)
        }}
        device={device}
        preset={
          selectedClimatePreset === CreateNewPresetSymbol
            ? undefined
            : selectedClimatePreset
        }
      />
    )
  }

  return (
    <>
      <Snackbar
        message={errorMessage}
        variant='error'
        visible={isError}
        automaticVisibility
      />

      <div className='seam-thermostat-climate-presets'>
        <ContentHeader title={t.title} onBack={onBack} />
        <div className='seam-thermostat-climate-presets-body'>
          <Button
            onClick={() => {
              setSelectedClimatePreset(CreateNewPresetSymbol)
            }}
            className='seam-climate-presets-add-button'
          >
            <AddIcon />
            {t.createNew}
          </Button>

          <div className='seam-thermostat-climate-presets-cards'>
            {device.properties.available_climate_presets.map((preset) => (
              <PresetCard
                onClickEdit={() => {
                  setSelectedClimatePreset(preset)
                }}
                onClickDelete={() => {
                  setClimatePresetKeySelectedForDeletion(
                    preset.climate_preset_key
                  )
                  mutate({
                    climate_preset_key: preset.climate_preset_key,
                    device_id: device.device_id,
                  })
                }}
                temperatureUnit={props.temperatureUnit}
                preset={preset}
                key={preset.climate_preset_key}
                deletionLoading={
                  isPending &&
                  climatePresetKeySelectedForDeletion ===
                    preset.climate_preset_key
                }
                disabled={
                  isPending &&
                  climatePresetKeySelectedForDeletion !==
                    preset.climate_preset_key
                }
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function PresetCard(
  props: HTMLAttributes<HTMLDivElement> & {
    preset: ThermostatClimatePreset
    temperatureUnit: 'fahrenheit' | 'celsius'
    onClickEdit: () => void
    onClickDelete: () => void
    deletionLoading?: boolean
    disabled?: boolean
  }
): JSX.Element {
  const {
    preset,
    temperatureUnit,
    onClickEdit,
    onClickDelete,
    deletionLoading = false,
    disabled = false,
    ...attrs
  } = props

  const heatPoint =
    temperatureUnit === 'fahrenheit'
      ? preset.heating_set_point_fahrenheit
      : (preset.heating_set_point_celsius ?? undefined)

  const coolPoint =
    temperatureUnit === 'fahrenheit'
      ? preset.cooling_set_point_fahrenheit
      : (preset.cooling_set_point_celsius ?? undefined)

  const unitSymbol = getTemperatureUnitSymbol(temperatureUnit)

  return (
    <div
      {...attrs}
      className={classNames(
        'seam-thermostat-climate-presets-card',
        attrs.className
      )}
    >
      <div className='seam-thermostat-climate-presets-card-top'>
        <div className='seam-thermostat-climate-presets-card-name'>
          {preset.display_name}

          {preset.name != null && (
            <div className='seam-thermostat-climate-presets-card-name-key'>
              {preset.climate_preset_key}
            </div>
          )}
        </div>

        <div className='seam-thermostat-climate-presets-card-buttons'>
          <IconButton
            disabled={disabled || deletionLoading || !preset.can_edit}
            onClick={onClickEdit}
            title={t.edit}
          >
            <EditIcon />
          </IconButton>

          <Popover
            content={({ hide }) => (
              <PopoverContentPrompt
                onCancel={hide}
                onConfirm={() => {
                  onClickDelete()
                  hide()
                }}
              />
            )}
          >
            {({ setRef }) => (
              <IconButton
                elRef={setRef}
                disabled={disabled || !preset.can_delete}
                title={t.delete}
              >
                {deletionLoading ? <Spinner size='small' /> : <TrashIcon />}
              </IconButton>
            )}
          </Popover>
        </div>
      </div>

      <div className='seam-thermostat-climate-presets-card-body'>
        {heatPoint != null && (
          <Chip
            icon={<ThermostatHeatIcon />}
            text={`${heatPoint} ${unitSymbol}`}
          />
        )}

        {coolPoint != null && (
          <Chip
            icon={<ThermostatCoolIcon />}
            text={`${coolPoint} ${unitSymbol}`}
          />
        )}

        {preset.fan_mode_setting != null && (
          <Chip icon={<FanIcon />} text={preset.fan_mode_setting} />
        )}
      </div>
    </div>
  )
}

function Chip({ icon, text }: { icon: ReactNode; text: string }): JSX.Element {
  return (
    <div className='seam-thermostat-climate-preset-chip'>
      <span className='seam-thermostat-climate-preset-chip-icon'>{icon}</span>
      <span className='seam-thermostat-climate-preset-chip-value'>{text}</span>
    </div>
  )
}

const t = {
  title: 'Climate Presets',
  createNew: 'Create New',
  delete: 'Delete',
  edit: 'Edit',
  unknownErrorOccured: 'An unknown error occurred.',
  climatePresetNotFound: 'Climate Preset not found.',
  deviceNotFound: 'Device not found.',
  climatePresetIsScheduled:
    'The climate preset has upcoming schedules and cannot be deleted.',
}
