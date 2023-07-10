import classNames from 'classnames'
import { forwardRef, useEffect, useState } from 'react'

import { formatTimeIso, formatTimeReadable } from 'lib/dates.js'
import { TextField, type TextFieldProps } from 'lib/ui/TextField/TextField.js'

type TimeTextFieldProps = Omit<TextFieldProps, 'onChange'> & {
  onChange: (value: string) => void
}

export const TimeTextField = forwardRef<
  HTMLInputElement | undefined,
  TimeTextFieldProps
>(function TimeTextField(
  { className, value = '', onChange, ...props },
  ref
): JSX.Element {
  const [readableValue, setReadableValue] = useState('')

  // Format raw value going IN
  useEffect(() => {
    if (value === '') {
      return
    }

    const readable = formatTimeReadable(value)

    if (readable === null) {
      return
    }

    setReadableValue(readable)
  }, [value])

  // Format readable value going OUT
  useEffect(() => {
    if (readableValue === value) {
      return
    }

    if (readableValue === '') {
      onChange('')
      return
    }

    const iso = formatTimeIso(readableValue)
    if (iso === null) {
      return
    }

    if (value === iso) {
      return
    }

    onChange(iso)
  }, [readableValue, value, onChange])

  return (
    <TextField
      value={readableValue}
      onChange={setReadableValue}
      {...props}
      className={classNames(className, 'seam-date-text-field')}
      clearable
      ref={ref}
    />
  )
})
