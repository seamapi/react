import classNames from 'classnames'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { formatTimeReadable } from 'lib/dates.js'
import {
  handleString,
  TextField,
  type TextFieldProps,
} from 'lib/ui/TextField/TextField.js'

type TimePickerProps = Omit<TextFieldProps, 'onChange'> & {
  onChange: (value: string) => void
}

export const TimePicker = forwardRef<
  HTMLInputElement | undefined,
  TimePickerProps
>(function TimeTextField(
  { className, value = '', onChange, ...props },
  ref
): JSX.Element {
  const [inputEl, setInputEl] = useState<HTMLInputElement | null | undefined>(
    null
  )

  const timeInputRef = useRef<HTMLInputElement>(null)

  // Maintain a local ref, and still forward it along
  useImperativeHandle(ref, () => (inputEl != null ? inputEl : undefined), [
    inputEl,
  ])

  const readableValue = formatTimeReadable(value) ?? ''

  return (
    <div className={classNames(className, 'seam-time-picker')}>
      <TextField
        value={readableValue}
        onChange={() => {}}
        onFocus={() => {
          if (inputEl != null) {
            inputEl.blur()
          }
        }}
        onClick={() => {
          if (timeInputRef.current != null) {
            timeInputRef.current.showPicker()
          }
        }}
        {...props}
        ref={setInputEl}
      />
      <input
        type='time'
        className='seam-native-picker'
        ref={timeInputRef}
        value={value}
        onChange={handleString(onChange)}
        pattern='[0-9]{2}:[0-9]{2}'
      />
    </div>
  )
})
