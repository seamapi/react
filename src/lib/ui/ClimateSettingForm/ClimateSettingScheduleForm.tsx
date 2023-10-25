import classNames from 'classnames'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { ClimateSetting, ThermostatDeviceProperties } from 'seamapi'

import { getSystemTimeZone } from 'lib/dates.js'
import { useSeamClient } from 'lib/index.js'
import { ClimateSettingScheduleFormDefaultClimateSetting } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleFormDefaultClimateSetting.js'
import { ClimateSettingScheduleFormDeviceSelect } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleFormDeviceSelect.js'
import { ClimateSettingScheduleFormNameAndSchedule } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleFormNameAndSchedule.js'
import { ClimateSettingScheduleFormTimeZonePicker } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleFormTimeZonePicker.js'

export interface ClimateSettingScheduleFormSubmitData {
  name: string
  deviceId: string
  startDate: string
  endDate: string
  timeZone: string
  climateSetting: ClimateSetting
}

export interface ClimateSettingScheduleFormProps {
  className?: string
  onBack?: () => void
  isSubmitting: boolean
  onSubmit: (data: ClimateSettingScheduleFormSubmitData) => void
}

export interface ClimateSettingScheduleFormFields {
  name: string
  deviceId: string
  startDate: string
  endDate: string
  timeZone: string
}

export function ClimateSettingScheduleForm({
  className,
  ...props
}: ClimateSettingScheduleFormProps): JSX.Element | null {
  return (
    <div
      className={classNames('seam-climate-setting-schedule-form', className)}
    >
      <Content {...props} />
    </div>
  )
}

function Content({
  onBack,
}: Omit<ClimateSettingScheduleFormProps, 'className'>): JSX.Element {
  const { control, watch } = useForm({
    defaultValues: {
      deviceId: '',
      name: '',
      startDate: '',
      endDate: '',
      timeZone: getSystemTimeZone(),
    },
  })

  const deviceId = watch('deviceId')
  const timeZone = watch('timeZone')

  const { client } = useSeamClient()

  const [page, setPage] = useState<
    | 'device_select'
    | 'default_setting'
    | 'name_and_schedule'
    | 'time_zone_select'
    | 'climate_setting'
  >('device_select')

  if (!client) return <></>

  const onDeviceSelect = async (deviceId: string) => {
    const device = await client.devices.get({ device_id: deviceId })

    const hasDefaultSetting = Boolean(
      (device?.properties as ThermostatDeviceProperties).default_climate_setting
    )

    if (hasDefaultSetting) setPage('name_and_schedule')
    else setPage('default_setting')
  }

  if (page === 'device_select') {
    return (
      <ClimateSettingScheduleFormDeviceSelect
        title={t.addNewClimateSettingSchedule}
        control={control}
        onBack={onBack}
        onSelect={onDeviceSelect}
      />
    )
  }

  if (page === 'default_setting') {
    return (
      <ClimateSettingScheduleFormDefaultClimateSetting
        title={t.addNewClimateSettingSchedule}
        deviceId={deviceId}
        onBack={() => {
          setPage('device_select')
        }}
        onCancel={onBack}
        onSave={() => {
          setPage('name_and_schedule')
        }}
      />
    )
  }

  if (page === 'name_and_schedule') {
    return (
      <ClimateSettingScheduleFormNameAndSchedule
        title={t.addNewClimateSettingSchedule}
        control={control}
        deviceId={deviceId}
        onBack={() => {
          setPage('device_select')
        }}
        onCancel={onBack}
        onNext={() => {
          setPage('climate_setting')
        }}
        onChangeTimeZone={() => {
          setPage('time_zone_select')
        }}
        timeZone={timeZone}
      />
    )
  }

  if (page === 'time_zone_select') {
    return (
      <ClimateSettingScheduleFormTimeZonePicker
        control={control}
        onClose={() => {
          setPage('name_and_schedule')
        }}
      />
    )
  }

  return <></>
}

export const t = {
  addNewClimateSettingSchedule: 'Add a climate setting schedule',
}
