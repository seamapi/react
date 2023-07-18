import classNames from 'classnames'
import { forwardRef, useEffect, useState } from 'react'

import { DatePicker } from 'lib/ui/DateTimePicker/DatePicker.js'
import { TimePicker } from 'lib/ui/DateTimePicker/TimePicker.js'
import type { TextFieldProps } from 'lib/ui/TextField/TextField.js'

type DateTimePickerProps = Pick<
  TextFieldProps,
  'size' | 'value' | 'className'
> & {
  onChange: (value: string) => void
}

export const DateTimePicker = forwardRef<
  HTMLInputElement | undefined,
  DateTimePickerProps
>(function DateTextField(
  { className, value, onChange, ...props },
  ref
): JSX.Element {
  const valueParts = value != null ? value.split('T') : undefined
  const [date = '', time = ''] = valueParts ?? []

  const [rawDate, setRawDate] = useState(date)
  const [rawTime, setRawTime] = useState(time)

  // Set raw values
  useEffect(() => {
    setRawDate(date)
    setRawTime(time)
  }, [date, time])

  // Handle changes
  useEffect(() => {
    if (rawDate === '' || rawTime === '') {
      return
    }

    if (rawDate === date && rawTime === time) {
      return
    }

    const updatedValue = `${rawDate}T${rawTime}`
    onChange(updatedValue)
  }, [rawDate, rawTime, onChange, date, time])

  return (
    <div className={classNames('seam-date-time-picker', className)}>
      <DatePicker value={rawDate} onChange={setRawDate} {...props} ref={ref} />
      <TimePicker value={rawTime} onChange={setRawTime} {...props} />
    </div>
  )
})
