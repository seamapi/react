import classNames from 'classnames'
import flatpickr from 'flatpickr'
import type { FlatpickrFn, Instance } from 'flatpickr/dist/types/instance.js'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { formatDateReadable } from 'lib/dates.js'
import { TextField, type TextFieldProps } from 'lib/ui/TextField/TextField.js'

// flatpickr seems to have a bug in their types where 'import flatpickr' doesn't
// resolve to the FlatpickrFn as expected resulting in a 'flatpickr has no
// call signatures error.
const createFlatpickr = flatpickr as unknown as FlatpickrFn

type DateTextFieldProps = Omit<TextFieldProps, 'onChange'> & {
  onChange: (value: string) => void
}

export const DateTextField = forwardRef<
  HTMLInputElement | undefined,
  DateTextFieldProps
>(function DateTextField(
  { className, value, onChange, ...props },
  ref
): JSX.Element {
  const [inputEl, setInputEl] = useState<HTMLInputElement | null | undefined>(
    null
  )

  // Maintain a local ref, and still forward it along
  useImperativeHandle(ref, () => (inputEl != null ? inputEl : undefined), [
    inputEl,
  ])

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

    const flatpickrInstance = createFlatpickr(inputEl, {
      minDate: 'today',
      locale: {
        // Configure to only show first letter of weekday, the default was
        // Sun, Mon, Tue ...
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

    // Scope to seam class for custom styles in case the consumer also uses
    // flatpickr, we wouldn't want to style their pickers.
    flatpickrInstance.calendarContainer.classList.add('seam-flatpickr')

    flatpickr.current = flatpickrInstance

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
})
