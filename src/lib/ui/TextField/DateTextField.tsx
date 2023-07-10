import classNames from 'classnames'
import flatpickr from 'flatpickr'
import type { FlatpickrFn, Instance } from 'flatpickr/dist/types/instance.js'
import { useEffect, useRef, useState } from 'react'

import { formatDateReadable } from 'lib/dates.js'
import { TextField, type TextFieldProps } from 'lib/ui/TextField/TextField.js'

// flatpickr seems to have a bug in their types where 'import flatpickr' doesn't
// resolve to the FlatpickrFn as expected resulting in a 'flatpickr has no
// call signatures error.
const createFlatpickr = flatpickr as unknown as FlatpickrFn

type DateTextFieldProps = Omit<TextFieldProps, 'onChange'> & {
  onChange: (value: string) => void
}

export function DateTextField({
  className,
  value,
  onChange,
  ...props
}: DateTextFieldProps): JSX.Element {
  const [inputEl, setInputEl] = useState<HTMLInputElement | null | undefined>(
    null
  )

  const flatpickr = useRef<Instance>()

  useEffect(() => {
    if (inputEl == null) {
      return
    }

    const handler = (event: Event): void => {
      if (event.target == null || !('value' in event.target)) {
        return
      }

      onChange(event.target.value as string)
    }

    inputEl.addEventListener('input', handler)

    const instance = createFlatpickr(inputEl, {
      locale: {
        weekdays: {
          shorthand: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          longhand: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
        },
      },
    })
    instance.calendarContainer.classList.add('seam-flatpickr')
    flatpickr.current = instance

    return () => {
      inputEl.removeEventListener('input', handler)
      flatpickr.current?.destroy()
    }
  }, [inputEl, onChange])

  // Unselect picker on clearing value
  useEffect(() => {
    if (value === '') {
      flatpickr.current?.clear()
    }
  }, [value])

  const readableDate = value != null ? formatDateReadable(value) : ''

  return (
    <TextField
      value={readableDate}
      onChange={() => {
        // no-op because we're relying on the datepicker bound directly
        // to the input's change events.
      }}
      {...props}
      className={classNames(className, 'seam-date-text-field')}
      clearable
      ref={setInputEl}
    />
  )
}
