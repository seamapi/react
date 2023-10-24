import classNames from 'classnames'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { ClimateSetting, HvacModeSetting } from 'seamapi'

import { getBrowserTimezone } from 'lib/dates.js'
import { ClimateSettingScheduleFormClimateSetting } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleFormClimateSetting.js'
import { ClimateSettingScheduleFormDeviceSelect } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleFormDeviceSelect.js'
import { ClimateSettingScheduleFormNameAndSchedule } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleFormNameAndSchedule.js'
import { ClimateSettingScheduleFormTimezonePicker } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleFormTimezonePicker.js'

export interface ClimateSettingScheduleFormSubmitData {
  name: string
  deviceId: string
  startDate: string
  endDate: string
  timezone: string
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
  timezone: string
  hvacModeSetting: HvacModeSetting
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
      timezone: getBrowserTimezone(),
      hvacModeSetting: 'heat' as HvacModeSetting,
    },
  })

  const deviceId = watch('deviceId')
  const timezone = watch('timezone')

  const [page, setPage] = useState<
    | 'device_select'
    | 'default_setting'
    | 'name_and_schedule'
    | 'timezone_select'
    | 'climate_setting'
  >('climate_setting')

  if (page === 'device_select') {
    return (
      <ClimateSettingScheduleFormDeviceSelect
        title={t.addNewClimateSettingSchedule}
        control={control}
        onBack={onBack}
        onSelect={() => {
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
        onChangeTimezone={() => {
          setPage('timezone_select')
        }}
        timezone={timezone}
      />
    )
  }

  if (page === 'timezone_select') {
    return (
      <ClimateSettingScheduleFormTimezonePicker
        control={control}
        onClose={() => {
          setPage('name_and_schedule')
        }}
      />
    )
  }

  if (page === 'climate_setting') {
    return (
      <ClimateSettingScheduleFormClimateSetting
        title={t.addNewClimateSettingSchedule}
        control={control}
        watch={watch}
        deviceId={deviceId}
        onBack={() => {
          setPage('name_and_schedule')
        }}
        onCancel={onBack}
        onSave={() => {
          console.log('saving')
        }}
      />
    )
  }

  return <></>
}

export const t = {
  addNewClimateSettingSchedule: 'Add a climate setting schedule',
}
