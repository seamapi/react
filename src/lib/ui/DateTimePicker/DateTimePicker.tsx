import classNames from 'classnames'
import { forwardRef, useState } from 'react'

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
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  return (
    <div className={classNames('seam-date-time-picker', className)}>
      <DatePicker value={date} onChange={setDate} {...props} ref={ref} />
      <TimePicker value={time} onChange={setTime} {...props} />
    </div>
  )
})
