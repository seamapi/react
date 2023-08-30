import classNames from 'classnames'
import { useState } from 'react'

import {
  get24HoursLater,
  getBrowserTimezone,
  getNow,
  getTimezoneFromIsoDate,
} from 'lib/dates.js'
// import type { UseClimateSettingScheduleData } from 'lib/seam/access-codes/use-access-code.js'
// import { ClimateSettingScheduleFormDatePicker } from 'lib/ui/ClimateSettingScheduleForm/ClimateSettingScheduleFormDatePicker.js'
// import { ClimateSettingScheduleFormTimes } from 'lib/ui/ClimateSettingScheduleForm/ClimateSettingScheduleFormTimes.js'
// import { ClimateSettingScheduleFormTimezonePicker } from 'lib/ui/ClimateSettingScheduleForm/ClimateSettingScheduleFormTimezonePicker.js'
import type { UseClimateSettingScheduleData } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import type { ClimateSetting } from 'seamapi'
import type { UseDeviceData } from '../../../hooks.js'
import { Button } from '../Button.js'
import { ClimateSettingScheduleDeviceSelect } from './ClimateSettingScheduleDeviceSelect.js'
import { ClimateSettingScheduleFormDateAndName } from './ClimateSettingScheduleFormDateAndName.js'
import { ClimateSettingScheduleFormTimezonePicker } from './ClimateSettingScheduleFormTimezonePicker.js'

export interface ClimateSettingScheduleFormSubmitData {
  name: string
  deviceId: string
  startDate: string
  endDate: string
  timezone: string
  climateSetting: Partial<ClimateSetting>
}

export interface ClimateSettingScheduleFormProps {
  className?: string
  onBack?: () => void
  devices: NonNullable<UseDeviceData>[]
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
  devices,
  climateSettingSchedule,
  onSubmit,
  isSubmitting,
}: Omit<ClimateSettingScheduleFormProps, 'className'>): JSX.Element {
  const [name, setName] = useState(climateSettingSchedule?.name ?? '')
  const [deviceId, setDeviceId] = useState<string>(
    climateSettingSchedule?.device_id ?? ''
  )

  const [timezone, setTimezone] = useState<string>(
    getClimateSettingScheduleTimezone(climateSettingSchedule) ??
      getBrowserTimezone()
  )
  const [startDate, setStartDate] = useState<string>(
    getClimateSettingScheduleDate(
      'schedule_starts_at',
      climateSettingSchedule
    ) ?? getNow()
  )
  const [endDate, setEndDate] = useState<string>(
    getClimateSettingScheduleDate('schedule_ends_at', climateSettingSchedule) ??
      get24HoursLater()
  )
  const [climateSetting, setClimateSetting] = useState<Partial<ClimateSetting>>(
    {}
  )

  const [page, setPage] = useState<
    | 'device_select'
    | 'default_setting'
    | 'name_and_time'
    | 'timezone_select'
    | 'climate_setting'
  >('name_and_time')

  const submit = (): void => {
    if (isSubmitting) {
      return
    }

    onSubmit({
      name,
      deviceId,
      startDate,
      endDate,
      timezone,
      climateSetting,
    })
  }

  if (page === 'device_select') {
    return (
      <div className='seam-main'>
        <ContentHeader title={t.addNewClimateSettingSchedule} onBack={onBack} />
        <ClimateSettingScheduleDeviceSelect
          devices={devices}
          onSelect={(deviceId) => {
            setDeviceId(deviceId)
            setPage('name_and_time')
          }}
        />
      </div>
    )
  }

  if (page === 'timezone_select') {
    return (
      <ClimateSettingScheduleFormTimezonePicker
        value={timezone}
        onChange={setTimezone}
        onClose={() => setPage('name_and_time')}
      />
    )
  }

  if (page === 'name_and_time') {
    return (
      <div className='seam-main'>
        <ContentHeader
          title={t.addNewClimateSettingSchedule}
          subheading={
            devices.find((d) => d.device_id === deviceId)?.properties.name
          }
          onBack={() => setPage('device_select')}
        />

        <ClimateSettingScheduleFormDateAndName
          name={name}
          setName={setName}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          timezone={timezone}
          onChangeTimezone={() => {
            setPage('timezone_select')
          }}
        />
        <div className='seam-actions'>
          <Button
            onClick={() => {
              console.log('TODO: back to scheduled climate list')
            }}
          >
            {t.cancel}
          </Button>
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
    )
  }

  if (page === 'climate_setting') {
    return (
      <div className='seam-main'>
        <ContentHeader
          title={t.addNewClimateSettingSchedule}
          subheading={
            devices.find((d) => d.device_id === deviceId)?.properties.name
          }
          onBack={() => setPage('name_and_time')}
        />
        <div className='seam-actions'>
          <Button
            onClick={() => {
              console.log('TODO: back to scheduled climate list')
            }}
          >
            {t.cancel}
          </Button>
          <Button variant='solid' onClick={submit}>
            {t.save}
          </Button>
        </div>
      </div>
    )
  }

  return <></>
}

function getClimateSettingScheduleTimezone(
  climateSettingSchedule?: NonNullable<UseClimateSettingScheduleData>
): undefined | string {
  if (climateSettingSchedule == null) {
    return undefined
  }

  const date = climateSettingSchedule.schedule_starts_at

  const timezone = getTimezoneFromIsoDate(date)
  if (timezone == null) {
    return undefined
  }

  return timezone
}

function getClimateSettingScheduleDate(
  date: 'schedule_starts_at' | 'schedule_ends_at',
  climateSettingSchedule?: NonNullable<UseClimateSettingScheduleData>
): string | undefined {
  if (climateSettingSchedule == null) {
    return undefined
  }

  return climateSettingSchedule[date]
}

const t = {
  addNewClimateSettingSchedule: 'Add a climate setting schedule',
  editClimateSettingSchedule: 'Edit climate setting schedule',
  nameInputLabel: 'Name the climate setting scheduled',
  cancel: 'Cancel',
  save: 'Save',
  next: 'Next',
  typeTimeBoundLabel: 'Start/end times',
}
