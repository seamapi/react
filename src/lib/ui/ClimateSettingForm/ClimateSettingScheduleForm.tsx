import classNames from 'classnames'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { ClimateSetting } from 'seamapi'

import { ClimateSettingScheduleFormDeviceSelect } from './ClimateSettingScheduleFormDeviceSelect.js'
import { ClimateSettingScheduleFormNameAndSchedule } from './ClimateSettingScheduleFormNameAndSchedule.js'

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
  const { control, watch } = useForm()

  const deviceId = watch('deviceId', null)

  const [page, setPage] = useState<
    | 'device_select'
    | 'default_setting'
    | 'name_and_schedule'
    | 'timezone_select'
    | 'climate_setting'
  >('device_select')

  if (page === 'device_select') {
    return (
      <ClimateSettingScheduleFormDeviceSelect
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
        control={control}
        deviceId={deviceId}
        onBack={() => {
          setPage('device_select')
        }}
        onCancel={onBack}
        onNext={() => {
          setPage('climate_setting')
        }}
      />
    )
  }

  return <></>
}

export const t = {
  addNewClimateSettingSchedule: 'Add a climate setting schedule',
}
