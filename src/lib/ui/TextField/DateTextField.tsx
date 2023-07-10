import classNames from 'classnames'
import flatpickr from 'flatpickr'
import type { FlatpickrFn } from 'flatpickr/dist/types/instance.js'
import { useEffect, useState } from 'react'

import { TextField, type TextFieldProps } from 'lib/ui/TextField/TextField.js'

// flatpickr seems to have a bug in their types where 'import flatpickr' doesn't
// resolve to the FlatpickrFn as expected resulting in a 'flatpickr has no
// call signatures error.
const createFlatpickr = flatpickr as unknown as FlatpickrFn

export function DateTextField({
  className,
  value,
  onChange,
  ...props
}: TextFieldProps): JSX.Element {
  const [inputEl, setInputEl] = useState<HTMLInputElement | null | undefined>(
    null
  )

  useEffect(() => {
    if (inputEl == null) {
      return
    }

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
  }, [inputEl])

  return (
    <>
      <TextField
        value={value}
        onChange={onChange}
        {...props}
        className={classNames(className, 'seam-date-text-field')}
        clearable
        ref={setInputEl}
      />
    </>
  )
}
