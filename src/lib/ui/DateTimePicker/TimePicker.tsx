import classNames from 'classnames'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'

import {
  formatTimeIso,
  formatTimeReadable,
  getMinuteIntervalsUntilEndOfDay,
} from 'lib/dates.js'
import { TextField, type TextFieldProps } from 'lib/ui/TextField/TextField.js'
import { useToggle } from 'lib/ui/use-toggle.js'

const optionIntervalMins = 15

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
  const [readableValue, setReadableValue] = useState('')
  const [optionsVisible, toggleOptions] = useToggle()
  const [inputEl, setInputEl] = useState<HTMLInputElement | null | undefined>(
    null
  )

  // Maintain a local ref, and still forward it along
  useImperativeHandle(ref, () => (inputEl != null ? inputEl : undefined), [
    inputEl,
  ])

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

  const options = useMemo(() => {
    if (optionsVisible) {
      return getMinuteIntervalsUntilEndOfDay(optionIntervalMins)
    }

    return []
  }, [optionsVisible])

  return (
    <>
      <TextField
        value={readableValue}
        onChange={setReadableValue}
        {...props}
        className={classNames(className, 'seam-time-picker')}
        clearable
        type='time'
        ref={setInputEl}
        onFocus={toggleOptions}
        onBlur={toggleOptions}
      />
    </>
  )
})
