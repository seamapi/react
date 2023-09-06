import classNames from 'classnames'
import { useState } from 'react'
import type { ClimateSetting } from 'seamapi'

import type { UseClimateSettingScheduleData } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

import { Controller, useForm } from 'react-hook-form'
import { ClimateSettingScheduleDeviceSelect } from './ClimateSettingScheduleDeviceSelect.js'

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
  climateSettingSchedule?: NonNullable<UseClimateSettingScheduleData>
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
  climateSettingSchedule,
}: Omit<ClimateSettingScheduleFormProps, 'className'>): JSX.Element {
  const { control } = useForm({
    defaultValues: {
      deviceId: climateSettingSchedule?.device_id ?? '',
    },
  })

  const [page, setPage] = useState<
    | 'device_select'
    | 'default_setting'
    | 'name_and_time'
    | 'timezone_select'
    | 'climate_setting'
  >('device_select')

  if (page === 'device_select') {
    return (
      <>
        <ContentHeader title={t.addNewClimateSettingSchedule} onBack={onBack} />
        <div className='seam-main'>
          <Controller
            name='deviceId'
            control={control}
            render={({ field: { onChange } }) => (
              <ClimateSettingScheduleDeviceSelect
                onSelect={(deviceId) => {
                  onChange(deviceId)
                  setPage('name_and_time')
                }}
              />
            )}
          />
        </div>
      </>
    )
  }

  return <></>
}

const t = {
  addNewClimateSettingSchedule: 'Add a climate setting schedule',
}
