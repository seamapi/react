import { getTimezoneLabel } from 'lib/dates.js'
import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { DateTimePicker } from 'lib/ui/DateTimePicker/DateTimePicker.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

interface AccessCodeFormDatePickerProps {
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
  timezone: string
  onChangeTimezone: () => void
  onBack: (() => void) | undefined
}

export function AccessCodeFormDatePicker({
  timezone,
  onBack,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onChangeTimezone,
}: AccessCodeFormDatePickerProps): JSX.Element {
  return (
    <div className='seam-schedule-picker'>
      <ContentHeader title={t.timingTitle} onBack={onBack} />
      <div className='seam-content'>
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
  timingTitle: 'Timing',
  selectedTimezoneLabel: 'All times in',
  startTimeLabel: 'Start',
  endTimeLabel: 'End',
}
