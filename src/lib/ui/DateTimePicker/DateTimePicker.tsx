import classNames from 'classnames'
import { forwardRef } from 'react'

import { TextField, type TextFieldProps } from 'lib/ui/TextField/TextField.js'

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
  return (
    <TextField
      type='datetime-local'
      className={classNames('seam-date-time-picker', className)}
      ref={ref}
      value={value}
      onChange={onChange}
      {...props}
    />
  )
})
