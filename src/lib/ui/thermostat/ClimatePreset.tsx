import classNames from 'classnames'
import { type HTMLAttributes, type Ref, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
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
      <ContentHeader title={preset == null ? t.crateNewPreset : preset.display_name} onBack={onBack} />
      {
        preset == null
          ? <CreateForm device={device} onComplete={onBack} />
          : <UpdateForm device={device} onComplete={onBack} preset={preset} />
      }
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
  editable: boolean
  deletable: boolean
  onSubmit: (values: PresetFormProps['defaultValues']) => void
  onDelete?: () => void
  device: ThermostatDevice
  loading: boolean
  instanceRef?: Ref<UseFormReturn<PresetFormProps['defaultValues']> | undefined>
  withKeyField?: boolean
}

function PresetForm(props: PresetFormProps): JSX.Element {
  const { defaultValues, device, deletable, editable, instanceRef, loading, onDelete, onSubmit, withKeyField } = props
  const _form = useForm({ defaultValues })

  useImperativeHandle(instanceRef, () => _form)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = _form

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


  const otherPresets = useMemo(
    () => {
      if (withKeyField !== true) return [];

      return (device.properties.available_climate_presets ?? []).filter(
        (other) => other.climate_preset_key !== defaultValues.key
      )
    },
    [defaultValues, device, withKeyField]
  )

  const onValid = useCallback(() => {
    onSubmit(state);
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
                  maxLength: {
                    value: 20,
                    message: 'max 20 chars',
                  },
                  minLength: {
                    value: 3,
                    message: 'min 3 chars',
                  },
                  validate(value) {
                    const normalizedValue = value.replace(/\s+/g, '').trim()
                    return !otherPresets.some(
                      (other) => other.climate_preset_key === normalizedValue
                    )
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
            inputProps={{
              ...register('name', {
                maxLength: {
                  value: 20,
                  message: t.max20Chars,
                },
                minLength: {
                  value: 3,
                  message: t.min3Chars,
                },
              }),
            }}
          />
        </FormField>

        {
          state.fanMode != null && (
            <FormField>
              <InputLabel>{t.fanModeField}</InputLabel>
              <Controller
                control={control}
                name='fanMode'
                render={({ field: { onChange, value } }) => (
                  value != null ? (
                    <FanModeMenu
                      block
                      size='large'
                      mode={value}
                      onChange={onChange}
                    />
                  ) : <></>
                )}
              />
            </FormField>
          )
        }

        {state.hvacMode != null && (
          <FormField>
            <InputLabel>{t.hvacModeField}</InputLabel>
            <Controller
              control={control}
              name='hvacMode'
              render={({ field: { onChange, value } }) => (
                value == null ? <></> : <ClimateModeMenu
                block
                size='large'
                buttonTextVisible
                mode={value}
                onChange={(value) => {
                  onHvacModeChange(value)
                  onChange(value)
                }}
              />
              )}
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
            type='button'
            variant='danger'
            disabled={loading || !deletable}
            onClick={onDelete}
          >
            {t.delete}
          </Button>

          <Button
            type='submit'
            variant='solid'
            disabled={loading || !editable}
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
  const instanceRef = useRef<UseFormReturn<PresetFormProps['defaultValues']>>()
  const mutation = useCreateThermostatClimatePreset()

  const onSubmit = useCallback((values: PresetFormProps['defaultValues']) => {
    if(instanceRef.current == null) return;

    const key = values.key.replace(/\s+/g, '').trim();
    const otherPresets = device.properties.available_climate_presets ?? [];

    if (otherPresets.some((other) => other.climate_preset_key === key)) {
      instanceRef.current.setError('key', {
        type: 'validate',
        message: t.keyErrorMsg,
      })
      return
    }

    mutation.mutate({
        climate_preset_key: key,
        device_id: device.device_id,
        name: values.name === '' ? undefined : values.name,
        cooling_set_point_fahrenheit: values.coolPoint,
        heating_set_point_fahrenheit: values.heatPoint,
        fan_mode_setting: values.fanMode,
        cooling_set_point_celsius: fahrenheitToCelsius(values.coolPoint),
        heating_set_point_celsius: fahrenheitToCelsius(values.heatPoint),
        hvac_mode_setting: values.hvacMode,
    }, { onSuccess: onComplete })
  }, [device, mutation, onComplete])

  return <PresetForm
    defaultValues={{
      key: '',
      coolPoint: 60,
      heatPoint: 80,
      name: '',
      hvacMode: 'off',
      fanMode: 'auto',
    }}
    deletable={false}
    editable={false}
    device={device}
    loading={mutation.isPending}
    onSubmit={onSubmit}
    instanceRef={instanceRef}
    withKeyField
  />
}

interface UpdateFormProps {
  device: ThermostatDevice
  onComplete: () => void
  preset: ThermostatClimatePreset
}

function UpdateForm({ device, onComplete, preset }: UpdateFormProps): JSX.Element {
  const mutation = useUpdateThermostatClimatePreset()
  const defaultValues = useMemo<PresetFormProps['defaultValues']>(() => ({
    coolPoint: preset.cooling_set_point_fahrenheit ?? 60,
    heatPoint: preset.heating_set_point_fahrenheit ?? 80,
    name: preset.display_name,
    hvacMode: preset.hvac_mode_setting,
    fanMode: preset.fan_mode_setting,
    key: preset.climate_preset_key,
  }), [preset])

  const onSubmit = useCallback((values: PresetFormProps['defaultValues']) => {
    mutation.mutate({
        climate_preset_key: values.key,
        device_id: device.device_id,
        name: values.name === '' ? undefined : values.name,
        cooling_set_point_fahrenheit: values.coolPoint,
        heating_set_point_fahrenheit: values.heatPoint,
        fan_mode_setting: values.fanMode,
        cooling_set_point_celsius: fahrenheitToCelsius(values.coolPoint),
        heating_set_point_celsius: fahrenheitToCelsius(values.heatPoint),
        hvac_mode_setting: values.hvacMode,
        manual_override_allowed: false,
    }, { onSuccess: onComplete })
  }, [device, mutation, onComplete])

  return <PresetForm
    defaultValues={defaultValues}
    deletable={preset.can_delete}
    editable={preset.can_edit}
    device={device}
    loading={mutation.isPending}
    onSubmit={onSubmit}
  />
}

const t = {
  keyErrorMsg: "Preset with this key already exists.",
  nameField: 'Display Name (Optional)',
  fanModeField: 'Fan Mode',
  hvacModeField: 'HVAC Mode',
  heatCoolField: 'Heat / Cool',
  delete: 'Delete',
  save: 'Save',
  max20Chars: 'max 20 chars',
  min3Chars: 'min 3 chars',
  crateNewPreset: 'Create New Preset',
}