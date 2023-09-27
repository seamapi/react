import { type Control, Controller } from 'react-hook-form'

import { getTimeZoneLabel } from 'lib/dates.js'
import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { useDevice } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import type { ClimateSettingScheduleFormFields } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleForm.js'
import { DateTimePicker } from 'lib/ui/DateTimePicker/DateTimePicker.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

interface ClimateSettingScheduleFormNameAndScheduleProps {
  title: string
  control: Control<ClimateSettingScheduleFormFields>
  deviceId: string
  timeZone: string
  onBack: () => void
  onCancel: (() => void) | undefined
  onNext: () => void
  onChangeTimeZone: () => void
}

export function ClimateSettingScheduleFormNameAndSchedule({
  title,
  control,
  deviceId,
  timeZone,
  onBack,
  onCancel,
  onNext,
  onChangeTimeZone,
}: ClimateSettingScheduleFormNameAndScheduleProps): JSX.Element {
  const { device } = useDevice({
    device_id: deviceId,
  })

  return (
    <>
      <ContentHeader
        title={title}
        onBack={onBack}
        subheading={device?.properties.name}
      />
      <div className='seam-main'>
        <div className='seam-climate-setting-schedule-form-name-and-schedule'>
          <div className='seam-content'>
            <FormField>
              <InputLabel>{t.nameInputLabel}</InputLabel>
              <Controller
                name='name'
                control={control}
                defaultValue=''
                render={({ field, fieldState: { invalid, error } }) => {
                  return (
                    <TextField
                      {...field}
                      size='large'
                      clearable
                      hasError={invalid}
                      helperText={error?.message}
                    />
                  )
                }}
              />
            </FormField>

            <FormField>
              <InputLabel>{t.startTimeLabel}</InputLabel>
              <div className='seam-time-zone'>
                <span className='seam-label'>{t.selectedTimeZoneLabel}</span>
                <span className='seam-selected' onClick={onChangeTimeZone}>
                  {getTimeZoneLabel(timeZone)}
                  <ChevronRightIcon />
                </span>
              </div>
              <Controller
                name='startDate'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <DateTimePicker {...field} size='large' />
                )}
              />
            </FormField>
            <FormField>
              <InputLabel>{t.endTimeLabel}</InputLabel>
              <Controller
                name='endDate'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <DateTimePicker {...field} size='large' />
                )}
              />
            </FormField>
          </div>
        </div>
        <div className='seam-actions'>
          <Button onClick={onCancel}>{t.cancel}</Button>
          <Button variant='solid' onClick={onNext}>
            {t.next}
          </Button>
        </div>
      </div>
    </>
  )
}

const t = {
  nameInputLabel: 'Name the climate setting schedule',
  startTimeLabel: 'Start time',
  endTimeLabel: 'End time',
  addNewClimateSettingSchedule: 'Add a climate setting schedule',
  cancel: 'Cancel',
  save: 'Save',
  next: 'Next',
  selectedTimeZoneLabel: 'All times in',
}
