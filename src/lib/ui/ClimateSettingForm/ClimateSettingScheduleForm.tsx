import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { ClimateSetting } from 'seamapi'

import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { ThermostatSelect } from 'lib/ui/thermostat/ThermostatSelect.js'

import { Button } from '../Button.js'
import { ClimateSettingScheduleFormDateAndName } from './ClimateSettingScheduleFormDateAndName.js'

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
  const { control, watch, register } = useForm()

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(value, name, type)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [watch])

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

  if (page === 'name_and_time') {
    return (
      <>
        <ContentHeader
          title={t.addNewClimateSettingSchedule}
          onBack={() => {
            setPage('device_select')
          }}
        />
        <div className='seam-main'>
          <ClimateSettingScheduleFormDateAndName control={control} />
          <div className='seam-actions'>
            <Button onClick={onBack}>{t.cancel}</Button>
            <Button
              variant='solid'
              onClick={() => {
                setPage('climate_setting')
              }}
            >
              {t.next}
            </Button>
          </div>
        </div>
      </>
    )
  }

  return <></>
}

const t = {
  addNewClimateSettingSchedule: 'Add a climate setting schedule',
  cancel: 'Cancel',
  save: 'Save',
  next: 'Next',
}
