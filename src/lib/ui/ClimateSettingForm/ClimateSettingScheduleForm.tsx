import classNames from 'classnames'
import { useState } from 'react'
import type { ClimateSetting } from 'seamapi'

import type { UseClimateSettingScheduleData } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

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
  const [_, setDeviceId] = useState<string>(
    climateSettingSchedule?.device_id ?? ''
  )

  const [page, setPage] = useState<
    | 'device_select'
    | 'default_setting'
    | 'name_and_time'
    | 'timezone_select'
    | 'climate_setting'
  >('device_select')

  if (page === 'device_select') {
    return (
      <div className='seam-main'>
        <ContentHeader title={t.addNewClimateSettingSchedule} onBack={onBack} />
        <ClimateSettingScheduleDeviceSelect
          onSelect={(deviceId) => {
            setDeviceId(deviceId)
            setPage('name_and_time')
          }}
        />
      </div>
    )
  }

  return <></>
}

const t = {
  addNewClimateSettingSchedule: 'Add a climate setting schedule',
}