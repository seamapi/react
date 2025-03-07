import classNames from 'classnames'
import { type HTMLAttributes, type ReactNode, useState } from 'react'

import { AddIcon } from 'lib/icons/Add.js'
import { EditIcon } from 'lib/icons/Edit.js'
import { FanIcon } from 'lib/icons/Fan.js'
import { ThermostatCoolIcon } from 'lib/icons/ThermostatCool.js'
import { ThermostatHeatIcon } from 'lib/icons/ThermostatHeat.js'
import { TrashIcon } from 'lib/icons/Trash.js'
import type { ThermostatClimatePreset, ThermostatDevice } from 'lib/seam/thermostats/thermostat-device.js'
import { getTemperatureUnitSymbol } from 'lib/seam/thermostats/unit-conversion.js'
import { useDeleteThermostatClimatePreset } from 'lib/seam/thermostats/use-delete-thermostat-climate-preset.js'
import { Button } from 'lib/ui/Button.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { Spinner } from 'lib/ui/Spinner/Spinner.js'
import { ClimatePreset } from 'lib/ui/thermostat/ClimatePreset.js'

interface ClimatePresetsManagement {
  device: ThermostatDevice
  onBack: () => void
  temperatureUnit: 'fahrenheit' | 'celsius'
}

const CreateNewPresetSymbol = Symbol('CreateNewPreset')

export function ClimatePresets(props: ClimatePresetsManagement): JSX.Element {
  const { device, onBack } = props

  const [selectedClimatePreset, setSelectedClimatePreset] = useState<
    ThermostatClimatePreset | typeof CreateNewPresetSymbol | null
  >(null)

  const [inDeletionPresetKey, setInDeletionPresetKey] = useState<
    ThermostatClimatePreset['climate_preset_key'] | null
  >(null)
  const deleteMutation = useDeleteThermostatClimatePreset()

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
                setInDeletionPresetKey(preset.climate_preset_key)
                deleteMutation.mutate({
                  climate_preset_key: preset.climate_preset_key,
                  device_id: device.device_id,
                })
              }}
              temperatureUnit={props.temperatureUnit}
              preset={preset}
              key={preset.climate_preset_key}
              deletionLoading={
                deleteMutation.isPending &&
                inDeletionPresetKey === preset.climate_preset_key
              }
              disabled={
                deleteMutation.isPending &&
                inDeletionPresetKey !== preset.climate_preset_key
              }
            />
          ))}
        </div>
      </div>
    </div>
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

  const chips = (
    [
      heatPoint != null
        ? { icon: <ThermostatHeatIcon />, value: `${heatPoint} ${unitSymbol}` }
        : undefined,
      coolPoint != null
        ? { icon: <ThermostatCoolIcon />, value: `${coolPoint} ${unitSymbol}` }
        : undefined,
      preset.fan_mode_setting != null
        ? { icon: <FanIcon />, value: preset.fan_mode_setting }
        : undefined,
    ].filter(Boolean) as Array<{ icon: ReactNode; value: string }>
  ).map(({ icon, value }, index) => (
    <div key={index} className='seam-thermostat-climate-preset-chip'>
      <span className='seam-thermostat-climate-preset-chip-icon'>{icon}</span>
      <span className='seam-thermostat-climate-preset-chip-value'>{value}</span>
    </div>
  ))

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

          <IconButton
            disabled={disabled || !preset.can_delete}
            onClick={onClickDelete}
            title={t.delete}
          >
            {deletionLoading ? <Spinner size='small' /> : <TrashIcon />}
          </IconButton>
        </div>
      </div>

      <div className='seam-thermostat-climate-presets-card-body'>{chips}</div>
    </div>
  )
}

const t = {
  title: 'Climate Presets',
  createNew: 'Create New',
  delete: 'Delete',
  edit: 'Edit',
}
