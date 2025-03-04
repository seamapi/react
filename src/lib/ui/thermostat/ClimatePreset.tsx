import classNames from 'classnames'
import { type HTMLAttributes, useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type {
  HvacModeSetting,
  ThermostatDevice,
} from 'lib/seam/thermostats/thermostat-device.js'
import { useCreateThermostatClimatePreset } from 'lib/seam/thermostats/use-create-thermostat-climate-preset.js'
import { useUpdateThermostatClimatePreset } from 'lib/seam/thermostats/use-update-thermostat-climate-preset.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TextField } from 'lib/ui/TextField/TextField.js'
import { ClimateModeMenu } from 'lib/ui/thermostat/ClimateModeMenu.js'
import { FanModeMenu } from 'lib/ui/thermostat/FanModeMenu.js'
import { TemperatureControlGroup } from 'lib/ui/thermostat/TemperatureControlGroup.js'

type Preset =
  ThermostatDevice['properties']['available_climate_presets'][number]

export type ClimatePresetProps = {
  preset?: Preset
  onBack: () => void
  device: ThermostatDevice
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

const toCelcius = (t: number): number => (t - 32) * (5 / 9)

export function ClimatePreset(props: ClimatePresetProps): JSX.Element {
  const { preset: _preset, onBack, device, ...attrs } = props

  const preset = useRef<Preset>(
    _preset ?? {
      climate_preset_key: '',
      can_edit: true,
      can_delete: true,
      display_name: '',
      fan_mode_setting: 'auto',
      hvac_mode_setting: 'off',
      heating_set_point_fahrenheit: 80,
      cooling_set_point_fahrenheit: 60,
      heating_set_point_celsius: toCelcius(80),
      cooling_set_point_celsius: toCelcius(60),
      manual_override_allowed: true,
      name: '',
    }
  ).current;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
    setError,
  } = useForm({
    defaultValues: {
      key: preset.climate_preset_key,
      name: preset.display_name,
      hvacMode: preset.hvac_mode_setting,
      heatPoint: preset.heating_set_point_fahrenheit,
      coolPoint: preset.cooling_set_point_fahrenheit,
      fanMode: preset.fan_mode_setting,
    },
  })

  const state = watch()

  const onHvacModeChange = (mode: HvacModeSetting): void => {
    if (mode === 'heat_cool') {
      setValue('heatPoint', preset.heating_set_point_fahrenheit)
      setValue('coolPoint', preset.cooling_set_point_fahrenheit)
    } else if (mode === 'heat') {
      setValue('heatPoint', preset.heating_set_point_fahrenheit)
      setValue('coolPoint', undefined)
    } else if (mode === 'cool') {
      setValue('heatPoint', undefined)
      setValue('coolPoint', preset.cooling_set_point_fahrenheit)
    } else {
      setValue('heatPoint', undefined)
      setValue('coolPoint', undefined)
    }
  }

  const allPresets = useMemo(
    () => device.properties.available_climate_presets ?? [],
    [device]
  )

  const otherPresets = useMemo(
    () =>
      allPresets.filter(
        (other) =>
          other.climate_preset_key !== preset.climate_preset_key
      ),
    [allPresets, preset]
  )

  const isCreate = _preset == null
  const createMutation = useCreateThermostatClimatePreset();
  const updateMutation = useUpdateThermostatClimatePreset();
  const loading = isCreate ? createMutation.isPending : updateMutation.isPending;

  const onSubmit = (): void => {
    if (isCreate && otherPresets.some((other) => other.climate_preset_key === state.key)) {
      setError('key', {
        type: 'validate',
        message: 'Preset with this key already exists.',
      })
      return
    }

    const name = state.name.replace(/\s+/g, ' ').trim();

    const body = {
      climate_preset_key: state.key,
      device_id: device.device_id,
      name: name === '' ? undefined : name,
      cooling_set_point_fahrenheit: state.coolPoint,
      heating_set_point_fahrenheit: state.heatPoint,
      fan_mode_setting: state.fanMode,
      cooling_set_point_celsius: typeof state.coolPoint === 'number' ? toCelcius(state.coolPoint) : undefined,
      heating_set_point_celsius: typeof state.heatPoint === 'number' ? toCelcius(state.heatPoint) : undefined,
      hvac_mode_setting: state.hvacMode,
    }

    if (isCreate) {
      createMutation.mutate(body)
    } else {
      updateMutation.mutate({
        ...body,
        manual_override_allowed: true,
      })
    }
  }

  return (
    <div
      {...attrs}
      className={classNames('seam-thermostat-climate-preset', attrs.className)}
    >
      <ContentHeader
        title={preset.display_name}
        onBack={onBack}
      />

      <div className='seam-main'>
        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e)
          }}
        >
          {
            isCreate && (
              <FormField>
            <InputLabel>Key</InputLabel>
            <TextField
              size='large'
              clearable
              hasError={errors.key != null}
              helperText={errors.key?.message}
              inputProps={{
                ...register('key', {
                  required: 'required',
                  maxLength: {
                    value: 20,
                    message: 'max 20 chars',
                  },
                  minLength: {
                    value: 3,
                    message: 'min 3 chars',
                  },
                  validate(value) {
                    const fixedValue = value.replace(/\s+/g, '').trim()
                    return !otherPresets.some(
                      (other) => other.climate_preset_key === fixedValue
                    )
                  },
                }),
              }}
            />
          </FormField>
            )
          }

          <FormField>
            <InputLabel>Display Name (Optional)</InputLabel>
            <TextField
              size='large'
              clearable
              hasError={errors.name != null}
              helperText={errors.name?.message}
              inputProps={{
                ...register('name', {
                  maxLength: {
                    value: 20,
                    message: 'max 20 chars',
                  },
                  minLength: {
                    value: 3,
                    message: 'min 3 chars',
                  },
                }),
              }}
            />
          </FormField>

          <FormField>
            <InputLabel>Fan Mode</InputLabel>
            <Controller
              control={control}
              name='fanMode'
              render={({ field: { onChange, value } }) => (
                <FanModeMenu
                  block
                  size='large'
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  mode={value!}
                  onChange={onChange}
                />
              )}
            />
          </FormField>

          <FormField>
            <InputLabel>HVAC Mode</InputLabel>
            <Controller
              control={control}
              name='hvacMode'
              render={({ field: { onChange, value } }) => (
                <ClimateModeMenu
                  block
                  size='large'
                  buttonTextVisible
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  mode={value!}
                  onChange={(value) => {
                    onChange(value)
                    onHvacModeChange(value)
                  }}
                />
              )}
            />
          </FormField>

          {state.hvacMode !== 'off' && (
            <FormField>
              <InputLabel>Heat / Cool</InputLabel>
              <TemperatureControlGroup
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                mode={state.hvacMode!}
                onHeatValueChange={(value) => {
                  setValue('heatPoint', value)
                }}
                onCoolValueChange={(value) => {
                  setValue('coolPoint', value)
                }}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                heatValue={state.heatPoint!}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                coolValue={state.coolPoint!}
                minHeat={65}
                maxHeat={100}
                minCool={50}
                maxCool={90}
                delta={5}
              />
            </FormField>
          )}

          <div className='seam-climate-preset-buttons'>
            <Button
              type='submit'
              variant='danger'
              disabled={loading || !preset.can_delete}
            >
              Delete
            </Button>

            <Button
              type='submit'
              variant='solid'
              disabled={loading || !preset.can_edit}
              loading={loading}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
