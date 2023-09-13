import classNames from 'classnames'
import { Controller, type Control, type FieldValues } from 'react-hook-form'

import { DateTimePicker } from 'lib/ui/DateTimePicker/DateTimePicker.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { TextField } from 'lib/ui/TextField/TextField.js'
import { useDevice } from '../../../hooks.js'
import { Button } from '../Button.js'
import { ContentHeader } from '../layout/ContentHeader.js'

interface ClimateSettingScheduleFormNameAndScheduleProps {
  control: Control<FieldValues, any>
  deviceId: string
  onBack: () => void
  onCancel: (() => void) | undefined
  onNext: () => void
  className?: string
}

export function ClimateSettingScheduleFormNameAndSchedule({
  deviceId,
  onBack,
  onCancel,
  onNext,
  control,
  className,
}: ClimateSettingScheduleFormNameAndScheduleProps): JSX.Element {
  const { device } = useDevice({
    device_id: deviceId,
  })

  return (
    <>
      <ContentHeader
        title={t.addNewClimateSettingSchedule}
        onBack={onBack}
        subheading={device?.properties.name}
      />
      <div className='seam-main'>
        <div
          className={classNames(
            'seam-climate-setting-schedule-form-name-and-schedule',
            className
          )}
        >
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
          <Button onClick={onCancel ?? undefined}>{t.cancel}</Button>
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
}
