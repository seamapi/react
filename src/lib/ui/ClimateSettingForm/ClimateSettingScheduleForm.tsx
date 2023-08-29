import classNames from 'classnames'
import { useState } from 'react'

import {
  get24HoursLater,
  getBrowserTimezone,
  getNow,
  getTimezoneFromIsoDate,
} from 'lib/dates.js'
// import type { UseClimateSettingScheduleData } from 'lib/seam/access-codes/use-access-code.js'
import { Button } from 'lib/ui/Button.js'
// import { ClimateSettingScheduleFormDatePicker } from 'lib/ui/ClimateSettingScheduleForm/ClimateSettingScheduleFormDatePicker.js'
// import { ClimateSettingScheduleFormTimes } from 'lib/ui/ClimateSettingScheduleForm/ClimateSettingScheduleFormTimes.js'
// import { ClimateSettingScheduleFormTimezonePicker } from 'lib/ui/ClimateSettingScheduleForm/ClimateSettingScheduleFormTimezonePicker.js'
import type { UseClimateSettingScheduleData } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { TextField } from 'lib/ui/TextField/TextField.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import type { ClimateSetting } from 'seamapi'
import type { UseDeviceData } from '../../../hooks.js'
import { ClimateSettingScheduleDeviceSelect } from './ClimateSettingScheduleDeviceSelect.js'

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
    'device_select' | 'default_setting' | 'name_and_time' | 'climate_setting'
  >('device_select')

  // const [datePickerVisible, setDatePickerVisible] = useState(false)
  // const [timezonePickerVisible, toggleTimezonePicker] = useToggle()

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
      <ClimateSettingScheduleDeviceSelect
        devices={devices}
        onBack={() => console.log('TODO: back to scheduled climate list')}
        onSelect={(deviceId) => {
          setDeviceId(deviceId)
          setPage('name_and_time')
        }}
      />
    )
  }

  // if (timezonePickerVisible) {
  //   return (
  //     <ClimateSettingScheduleFormTimezonePicker
  //       value={timezone}
  //       onChange={setTimezone}
  //       onClose={toggleTimezonePicker}
  //     />
  //   )
  // }

  // if (datePickerVisible) {
  //   return (
  //     <ClimateSettingScheduleFormDatePicker
  //       startDate={startDate}
  //       setStartDate={setStartDate}
  //       endDate={endDate}
  //       setEndDate={setEndDate}
  //       timezone={timezone}
  //       onChangeTimezone={toggleTimezonePicker}
  //       onBack={() => {
  //         setDatePickerVisible(false)
  //       }}
  //     />
  //   )
  // }

  const nameError = name.length > 60 ? t.overCharacterLimitError : undefined

  const isFormValid =
    name.trim().length > 0 && nameError === undefined && !isSubmitting

  const title =
    climateSettingSchedule == null
      ? t.addNewClimateSettingSchedule
      : t.editClimateSettingSchedule

  return (
    <>
      <ContentHeader title={title} onBack={onBack} />
      <div className='seam-main'>
        <FormField>
          <InputLabel>{t.nameInputLabel}</InputLabel>
          <TextField
            size='large'
            clearable
            value={name}
            onChange={setName}
            hasError={nameError != null}
            helperText={nameError}
          />
        </FormField>
        <div className='seam-actions'>
          <Button onClick={onBack}>{t.cancel}</Button>
          <Button variant='solid' disabled={!isFormValid} onMouseDown={submit}>
            {t.save}
          </Button>
        </div>
      </div>
    </>
  )
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
  overCharacterLimitError: '60 characters max',
  nameInputLabel: 'Name the climate setting scheduled',
  cancel: 'Cancel',
  save: 'Save',
  typeTimeBoundLabel: 'Start/end times',
}
