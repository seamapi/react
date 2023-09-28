import type { DateTime } from 'luxon'

import {
  formatTimeZone,
  parseDateTimePickerValue,
  serializeDateTimePickerValue,
} from 'lib/dates.js'
import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { DateTimePicker } from 'lib/ui/DateTimePicker/DateTimePicker.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

interface AccessCodeFormDatePickerProps {
  startDate: DateTime
  setStartDate: (dateTime: DateTime) => void
  endDate: DateTime
  setEndDate: (dateTime: DateTime) => void
  timeZone: string
  onChangeTimeZone: () => void
  onBack: (() => void) | undefined
}

export function AccessCodeFormDatePicker({
  timeZone,
  onBack,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onChangeTimeZone,
}: AccessCodeFormDatePickerProps): JSX.Element {
  return (
    <div className='seam-schedule-picker'>
      <ContentHeader title={t.timingTitle} onBack={onBack} />
      <div className='seam-content'>
        <div className='seam-time-zone'>
          <span className='seam-label'>{t.selectedTimeZoneLabel}</span>
          <span className='seam-selected' onClick={onChangeTimeZone}>
            {formatTimeZone(timeZone)}
            <ChevronRightIcon />
          </span>
        </div>
        <FormField>
          <InputLabel>{t.startTimeLabel}</InputLabel>
          <DateTimePicker
            value={serializeDateTimePickerValue(startDate, timeZone) ?? ''}
            onChange={(value: string) => {
              setStartDate(parseDateTimePickerValue(value, timeZone))
            }}
            size='large'
          />
        </FormField>
        <FormField>
          <InputLabel>{t.endTimeLabel}</InputLabel>
          <DateTimePicker
            value={serializeDateTimePickerValue(endDate, timeZone) ?? ''}
            onChange={(value: string) => {
              setEndDate(parseDateTimePickerValue(value, timeZone))
            }}
            size='large'
          />
        </FormField>
      </div>
    </div>
  )
}

const t = {
  timingTitle: 'Timing',
  selectedTimeZoneLabel: 'All times in',
  startTimeLabel: 'Start',
  endTimeLabel: 'End',
}
