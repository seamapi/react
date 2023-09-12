import classNames from 'classnames'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { ClimateSetting } from 'seamapi'

import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

import { ThermostatSelect } from '../thermostat/ThermostatSelect.js'

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
  const { control } = useForm()

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
              <ThermostatSelect
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
