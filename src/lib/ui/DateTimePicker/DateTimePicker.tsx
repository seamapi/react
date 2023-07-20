import classNames from 'classnames'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { formatDateTimeReadable } from 'lib/dates.js'
import {
  handleString,
  TextField,
  type TextFieldProps,
} from 'lib/ui/TextField/TextField.js'

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
  const [textInput, setTextInput] = useState<
    HTMLInputElement | null | undefined
  >(null)

  const nativeInputRef = useRef<HTMLInputElement>(null)

  // Maintain a local ref, and still forward it along
  useImperativeHandle(ref, () => (textInput != null ? textInput : undefined), [
    textInput,
  ])

  const readableValue = value != null ? formatDateTimeReadable(value) : ''

  return (
    <div className={classNames('seam-date-time-picker', className)}>
      <TextField
        value={readableValue}
        onChange={() => {}}
        onFocus={() => {
          if (textInput != null) {
            textInput.blur()
          }
        }}
        onClick={() => {
          if (nativeInputRef.current != null) {
            nativeInputRef.current.showPicker()
          }
        }}
        {...props}
        ref={setTextInput}
      />
      <input
        type='datetime-local'
        className='seam-native-picker'
        ref={nativeInputRef}
        value={value}
        onChange={handleString(onChange)}
      />
    </div>
  )
})
