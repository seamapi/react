import classNames from 'classnames'
import { type HTMLAttributes, useState } from 'react'

import { AddIcon } from 'lib/icons/Add.js'
import { EditIcon } from 'lib/icons/Edit.js'
import { TrashIcon } from 'lib/icons/Trash.js'
import type { ThermostatDevice } from 'lib/seam/thermostats/thermostat-device.js'
import { Button } from 'lib/ui/Button.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { ClimatePreset } from 'lib/ui/thermostat/ClimatePreset.js'

export interface ClimatePresetsManagement {
  device: ThermostatDevice
  onBack: () => void
  temperatureUnit: 'fahrenheit' | 'celsius'
}

type Preset =
  ThermostatDevice['properties']['available_climate_presets'][number]

export function ClimatePresets(props: ClimatePresetsManagement): JSX.Element {
  const { device, onBack } = props

  const [selectedClimatePreset, setSelectedClimatePreset] =
    useState<Preset | null>(null)

  if (selectedClimatePreset != null) {
    return (
      <ClimatePreset
        onBack={() => {
          setSelectedClimatePreset(null)
        }}
        device={device}
        preset={selectedClimatePreset}
      />
    )
  }

  return (
    <div className='seam-thermostat-climate-presets'>
      <ContentHeader title='Climate Presets' onBack={onBack} />
      <div className='seam-thermostat-climate-presets-body'>
        <Button className='seam-climate-presets-add-button'>
          <AddIcon />
          Create New
        </Button>

        <div className='seam-thermostat-climate-presets-cards'>
          {device.properties.available_climate_presets.map((preset) => (
            <PresetCard
              onClickEdit={() => {
                setSelectedClimatePreset(preset)
              }}
              onClickDelete={() => {
                console.log('delete')
              }}
              temperatureUnit={props.temperatureUnit}
              preset={preset}
              key={preset.climate_preset_key}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PresetCard(
  props: HTMLAttributes<HTMLDivElement> & {
    preset: Preset
    temperatureUnit: 'fahrenheit' | 'celsius'
    onClickEdit: () => void
    onClickDelete: () => void
  }
): JSX.Element {
  const { preset, temperatureUnit, onClickEdit, onClickDelete, ...attrs } =
    props

  const heatPoint =
    temperatureUnit === 'fahrenheit'
      ? preset.heating_set_point_fahrenheit
      : (preset.heating_set_point_celsius ?? undefined)

  const coolPoint =
    temperatureUnit === 'fahrenheit'
      ? preset.cooling_set_point_fahrenheit
      : (preset.cooling_set_point_celsius ?? undefined)

  const unitSymbol = temperatureUnit === 'fahrenheit' ? '˚F' : '˚C'

  const chips = (
    [
      heatPoint != null
        ? { name: 'Heat', value: `${heatPoint} ${unitSymbol}` }
        : undefined,
      coolPoint != null
        ? { name: 'Cool', value: `${coolPoint} ${unitSymbol}` }
        : undefined,
      preset.hvac_mode_setting != null
        ? { name: 'HVAC', value: preset.hvac_mode_setting }
        : undefined,
      preset.fan_mode_setting != null
        ? { name: 'Fan', value: preset.fan_mode_setting }
        : undefined,
    ].filter(Boolean) as Array<{ name: string; value: string }>
  ).map(({ name, value }, index) => (
    <div key={index} className='seam-thermostat-climate-preset-chip'>
      <span className='seam-thermostat-climate-preset-chip-name'>{name}</span>
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
          <IconButton disabled={!preset.can_edit} onClick={onClickEdit}>
            <EditIcon />
          </IconButton>

          <IconButton disabled={!preset.can_delete} onClick={onClickDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      <div className='seam-thermostat-climate-presets-card-body'>{chips}</div>
    </div>
  )
}
