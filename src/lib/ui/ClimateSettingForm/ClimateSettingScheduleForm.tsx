import classNames from 'classnames'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { ClimateSetting, HvacModeSetting } from 'seamapi'

import { getSystemTimeZone } from 'lib/dates.js'
import { ClimateSettingScheduleFormClimateSetting } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleFormClimateSetting.js'
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
  hvacModeSetting: HvacModeSetting
  setPoints: {
    heatingSetPoint: number
    coolingSetPoint: number
  }
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
  const { control, watch, resetField } = useForm({
    defaultValues: {
      deviceId: '',
      name: '',
      startDate: '',
      endDate: '',
      timeZone: getSystemTimeZone(),
      hvacModeSetting: 'heat_cool' as HvacModeSetting,
      setPoints: {
        heatingSetPoint: 70,
        coolingSetPoint: 75,
      },
    },
  })

  const deviceId = watch('deviceId')
  const timeZone = watch('timeZone')

  const [page, setPage] = useState<
    | 'device_select'
    | 'default_setting'
    | 'name_and_schedule'
    | 'time_zone_select'
    | 'climate_setting'
  >('device_select')

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

  if (page === 'climate_setting') {
    return (
      <ClimateSettingScheduleFormClimateSetting
        title={t.addNewClimateSettingSchedule}
        control={control}
        watch={watch}
        resetField={resetField}
        deviceId={deviceId}
        onBack={() => {
          setPage('name_and_schedule')
        }}
        onCancel={onBack}
        onSave={() => {}}
      />
    )
  }

  return <></>
}

export const t = {
  addNewClimateSettingSchedule: 'Add a climate setting schedule',
}
