import classNames from 'classnames'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { formatDateReadable } from 'lib/dates.js'
import {
  handleString,
  TextField,
  type TextFieldProps,
} from 'lib/ui/TextField/TextField.js'

type DatePickerProps = Omit<TextFieldProps, 'onChange' | 'value'> & {
  value: string
  onChange: (value: string) => void
}

export const DatePicker = forwardRef<
  HTMLInputElement | undefined,
  DatePickerProps
>(function DateTextField(
  { className, value, onChange, ...props },
  ref
): JSX.Element {
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [inputEl, setInputEl] = useState<HTMLInputElement | null | undefined>(
    null
  )

  // Maintain a local ref, and still forward it along
  useImperativeHandle(ref, () => (inputEl != null ? inputEl : undefined), [
    inputEl,
  ])

  const readableDate = value !== '' ? formatDateReadable(value) : ''

  return (
    <div className={classNames(className, 'seam-date-picker')}>
      <TextField
        value={readableDate}
        onFocus={() => {
          if (inputEl != null) {
            inputEl.blur()
          }
        }}
        onClick={() => {
          if (dateInputRef.current != null) {
            dateInputRef.current.showPicker()
          }
        }}
        onChange={() => {
          // no-op. prevent any changes via text input, and force
          // user to use the picker.
        }}
        {...props}
        ref={setInputEl}
      />
      <input
        type='date'
        className='seam-native-picker'
        ref={dateInputRef}
        value={value}
        onChange={handleString(onChange)}
      />
    </div>
  )
})
