import classNames from 'classnames'
import { TextField } from 'lib/ui/TextField/TextField.js'

import { getTimezoneLabel } from 'lib/dates.js'
import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { DateTimePicker } from 'lib/ui/DateTimePicker/DateTimePicker.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'

interface ClimateSettingScheduleFormDatePickerProps {
  name: string
  setName: (name: string) => void
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
  timezone: string
  onChangeTimezone: () => void
  className?: string
}

export function ClimateSettingScheduleFormDateAndName({
  name,
  setName,
  timezone,
  className,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onChangeTimezone,
}: ClimateSettingScheduleFormDatePickerProps): JSX.Element {
  const nameError = name.length > 60 ? t.overCharacterLimitError : undefined

  // TODO: validation

  return (
    <div className={classNames('seam-schedule-picker', className)}>
      <div className='seam-content'>
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
        <div className='seam-timezone'>
          <span className='seam-label'>{t.selectedTimezoneLabel}</span>
          <span className='seam-selected' onClick={onChangeTimezone}>
            {getTimezoneLabel(timezone)}
            <ChevronRightIcon />
          </span>
        </div>
        <FormField>
          <InputLabel>{t.startTimeLabel}</InputLabel>
          <DateTimePicker
            value={startDate ?? ''}
            onChange={setStartDate}
            size='large'
          />
        </FormField>
        <FormField>
          <InputLabel>{t.endTimeLabel}</InputLabel>
          <DateTimePicker
            value={endDate ?? ''}
            onChange={setEndDate}
            size='large'
          />
        </FormField>
      </div>
    </div>
  )
}

const t = {
  overCharacterLimitError: '60 characters max',
  nameInputLabel: 'Name the climate setting',
  selectedTimezoneLabel: 'All times in',
  startTimeLabel: 'Start time',
  endTimeLabel: 'End time',
}
