import classNames from 'classnames'
import type { Control,FieldValues  ,Controller} from 'react-hook-form'

import { DateTimePicker } from 'lib/ui/DateTimePicker/DateTimePicker.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

interface ClimateSettingScheduleFormDatePickerProps {
  control: Control<FieldValues, any>
  className?: string
}

export function ClimateSettingScheduleFormDateAndName({
  control,
  className,
}: ClimateSettingScheduleFormDatePickerProps): JSX.Element {
  return (
    <div className={classNames('seam-schedule-picker', className)}>
      <div className='seam-content'>
        <FormField>
          <InputLabel>{t.nameInputLabel}</InputLabel>
          <Controller
            name='name'
            control={control}
            rules={{ maxLength: 10 }}
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
            render={({ field }) => <DateTimePicker {...field} size='large' />}
          />
        </FormField>
        <FormField>
          <InputLabel>{t.endTimeLabel}</InputLabel>
          <Controller
            name='endDate'
            control={control}
            defaultValue=''
            render={({ field }) => <DateTimePicker {...field} size='large' />}
          />
        </FormField>
      </div>
    </div>
  )
}

const t = {
  nameInputLabel: 'Name the climate setting',
  startTimeLabel: 'Start time',
  endTimeLabel: 'End time',
}
