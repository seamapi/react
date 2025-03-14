import classNames from 'classnames'
import {
  type HTMLAttributes,
  type Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import type {
  FanModeSetting,
  HvacModeSetting,
  ThermostatClimatePreset,
  ThermostatDevice,
} from 'lib/seam/thermostats/thermostat-device.js'
import { fahrenheitToCelsius } from 'lib/seam/thermostats/unit-conversion.js'
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

export type ClimatePresetProps = {
  preset?: ThermostatClimatePreset
  onBack: () => void
  device: ThermostatDevice
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export function ClimatePreset(props: ClimatePresetProps): JSX.Element {
  const { preset, onBack, device, ...attrs } = props

  return (
    <div
      {...attrs}
      className={classNames('seam-thermostat-climate-preset', attrs.className)}
    >
      <ContentHeader
        title={preset == null ? t.crateNewPreset : preset.display_name}
        onBack={onBack}
      />
      {preset == null ? (
        <CreateForm device={device} onComplete={onBack} />
      ) : (
        <UpdateForm device={device} onComplete={onBack} preset={preset} />
      )}
    </div>
  )
}

interface PresetFormProps {
  defaultValues: {
    key: string
    name: string
    hvacMode: HvacModeSetting | undefined
    heatPoint: number | undefined
    coolPoint: number | undefined
    fanMode: FanModeSetting | undefined
  }
  onSubmit: (values: PresetFormProps['defaultValues']) => void
  device: ThermostatDevice
  loading: boolean
  instanceRef?: Ref<UseFormReturn<PresetFormProps['defaultValues']> | undefined>
  withKeyField?: boolean
}

function PresetForm(props: PresetFormProps): JSX.Element {
  const {
    defaultValues,
    device,
    instanceRef,
    loading,
    onSubmit,
    withKeyField,
  } = props
  const form = useForm({ defaultValues })

  useImperativeHandle(instanceRef, () => form)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = form

  const state = watch()

  const onHvacModeChange = (mode: HvacModeSetting): void => {
    if (mode === 'heat_cool') {
      setValue('heatPoint', defaultValues.heatPoint)
      setValue('coolPoint', defaultValues.coolPoint)
    } else if (mode === 'heat') {
      setValue('heatPoint', defaultValues.heatPoint)
      setValue('coolPoint', undefined)
    } else if (mode === 'cool') {
      setValue('heatPoint', undefined)
      setValue('coolPoint', defaultValues.coolPoint)
    } else {
      setValue('heatPoint', undefined)
      setValue('coolPoint', undefined)
    }
  }

  const otherClimatePresets = useMemo(() => {
    if (withKeyField !== true) return []

    return (device.properties.available_climate_presets ?? []).filter(
      (other) => other.climate_preset_key !== defaultValues.key
    )
  }, [defaultValues, device, withKeyField])

  const onValid = useCallback(() => {
    onSubmit(state)
  }, [onSubmit, state])

  return (
    <div className='seam-main'>
      <form
        onSubmit={(e) => {
          void handleSubmit(onValid)(e)
        }}
      >
        {withKeyField === true && (
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
                  setValueAs: (value) => value.trim(),
                  validate(value) {
                    if (value.includes(' ')) {
                      return t.keyCannotContainSpaces
                    }

                    const exists = otherClimatePresets.some(
                      (other) => other.climate_preset_key === value
                    )

                    if (exists) {
                      return t.keyAlreadyExists
                    }

                    return true
                  },
                }),
              }}
            />
          </FormField>
        )}

        <FormField>
          <InputLabel>{t.nameField}</InputLabel>
          <TextField
            size='large'
            clearable
            hasError={errors.name != null}
            helperText={errors.name?.message}
            inputProps={register('name', {
              required: false,
              setValueAs: (value) => value.trim(),
            })}
          />
        </FormField>

        {state.fanMode != null && (
          <FormField>
            <InputLabel>{t.fanModeField}</InputLabel>
            <Controller
              control={control}
              name='fanMode'
              render={({ field: { onChange, value } }) =>
                value != null ? (
                  <FanModeMenu
                    block
                    size='large'
                    mode={value}
                    onChange={onChange}
                  />
                ) : (
                  <></>
                )
              }
            />
          </FormField>
        )}

        {state.hvacMode != null && (
          <FormField>
            <InputLabel>{t.hvacModeField}</InputLabel>
            <Controller
              control={control}
              name='hvacMode'
              render={({ field: { onChange, value } }) =>
                value == null ? (
                  <></>
                ) : (
                  <ClimateModeMenu
                    block
                    size='large'
                    buttonTextVisible
                    mode={value}
                    onChange={(value) => {
                      onHvacModeChange(value)
                      onChange(value)
                    }}
                  />
                )
              }
            />
          </FormField>
        )}

        {state.hvacMode !== 'off' && state.hvacMode != null && (
          <FormField>
            <InputLabel>{t.heatCoolField}</InputLabel>
            <TemperatureControlGroup
              mode={state.hvacMode}
              onHeatValueChange={(value) => {
                setValue('heatPoint', value)
              }}
              onCoolValueChange={(value) => {
                setValue('coolPoint', value)
              }}
              heatValue={state.heatPoint ?? 0}
              coolValue={state.coolPoint ?? 0}
              minHeat={device.properties.min_heating_cooling_delta_fahrenheit}
              maxHeat={device.properties.max_heating_set_point_fahrenheit}
              minCool={device.properties.min_cooling_set_point_fahrenheit}
              maxCool={device.properties.max_cooling_set_point_fahrenheit}
              delta={device.properties.min_heating_cooling_delta_fahrenheit}
            />
          </FormField>
        )}

        <div className='seam-climate-preset-buttons'>
          <Button
            type='submit'
            variant='solid'
            disabled={loading}
            loading={loading}
          >
            {t.save}
          </Button>
        </div>
      </form>
    </div>
  )
}

interface CreateFormProps {
  device: ThermostatDevice
  onComplete: () => void
}

function CreateForm({ device, onComplete }: CreateFormProps): JSX.Element {
  const mutation = useCreateThermostatClimatePreset()

  const onSubmit = useCallback(
    (values: PresetFormProps['defaultValues']) => {
      mutation.mutate(
        {
          climate_preset_key: values.key,
          device_id: device.device_id,
          name: values.name === '' ? undefined : values.name,
          cooling_set_point_fahrenheit: values.coolPoint,
          heating_set_point_fahrenheit: values.heatPoint,
          fan_mode_setting: values.fanMode,
          cooling_set_point_celsius: fahrenheitToCelsius(values.coolPoint),
          heating_set_point_celsius: fahrenheitToCelsius(values.heatPoint),
          hvac_mode_setting: values.hvacMode,
        },
        { onSuccess: onComplete }
      )
    },
    [device, mutation, onComplete]
  )

  return (
    <PresetForm
      defaultValues={{
        key: '',
        coolPoint: 60,
        heatPoint: 80,
        name: '',
        hvacMode: 'off',
        fanMode: 'auto',
      }}
      device={device}
      loading={mutation.isPending}
      onSubmit={onSubmit}
      withKeyField
    />
  )
}

interface UpdateFormProps {
  device: ThermostatDevice
  onComplete: () => void
  preset: ThermostatClimatePreset
}

function UpdateForm({
  device,
  onComplete,
  preset,
}: UpdateFormProps): JSX.Element {
  const mutation = useUpdateThermostatClimatePreset()
  const defaultValues = useMemo<PresetFormProps['defaultValues']>(
    () => ({
      coolPoint: preset.cooling_set_point_fahrenheit ?? 60,
      heatPoint: preset.heating_set_point_fahrenheit ?? 80,
      name: preset.display_name,
      hvacMode: preset.hvac_mode_setting,
      fanMode: preset.fan_mode_setting,
      key: preset.climate_preset_key,
    }),
    [preset]
  )

  const onSubmit = useCallback(
    (values: PresetFormProps['defaultValues']) => {
      mutation.mutate(
        {
          climate_preset_key: values.key,
          device_id: device.device_id,
          name: values.name === '' ? undefined : values.name,
          cooling_set_point_fahrenheit: values.coolPoint,
          heating_set_point_fahrenheit: values.heatPoint,
          fan_mode_setting: values.fanMode,
          cooling_set_point_celsius: fahrenheitToCelsius(values.coolPoint),
          heating_set_point_celsius: fahrenheitToCelsius(values.heatPoint),
          hvac_mode_setting: values.hvacMode,
        },
        { onSuccess: onComplete }
      )
    },
    [device, mutation, onComplete]
  )

  return (
    <PresetForm
      defaultValues={defaultValues}
      device={device}
      loading={mutation.isPending}
      onSubmit={onSubmit}
    />
  )
}

const t = {
  keyAlreadyExists: 'Climate Preset with this key already exists.',
  keyCannotContainSpaces: 'Climate Preset key cannot contain spaces.',
  nameField: 'Display Name (Optional)',
  fanModeField: 'Fan Mode',
  hvacModeField: 'HVAC Mode',
  heatCoolField: 'Heat / Cool',
  delete: 'Delete',
  save: 'Save',
  crateNewPreset: 'Create New Climate Preset',
}
