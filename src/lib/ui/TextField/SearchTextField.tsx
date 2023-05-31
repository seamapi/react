import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { CloseIcon } from 'lib/icons/Close.js'
import { SearchIcon } from 'lib/icons/Search.js'
import { TextField, type TextFieldProps } from 'lib/ui/TextField/TextField.js'

export function SearchTextField({
  className,
  value,
  onChange,
  ...props
}: TextFieldProps): JSX.Element {
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null)

  const valueIsEmpty = useValueIsEmpty(value, inputEl)
  const clearInput = (): void => {
    if (onChange != null) {
      onChange('')
      return
    }

    if (inputEl != null) {
      inputEl.value = ''
    }
  }

  return (
    <TextField
      value={value}
      onChange={onChange}
      {...props}
      className={classNames(className, 'seam-search-text-field')}
      startAdornment={<SearchIcon />}
      inputProps={{
        ref: setInputEl,
        placeholder: 'Search',
      }}
      endAdornment={
        <button
          className={classNames({
            'seam-hidden': valueIsEmpty,
          })}
          onClick={clearInput}
        >
          <CloseIcon />
        </button>
      }
    />
  )
}

function useValueIsEmpty(
  value: string | undefined,
  inputEl: HTMLInputElement | null
): boolean {
  const [valueIsEmpty, setValueIsEmpty] = useState(true)

  // If this is a controlled element, we'll just look at `value`
  useEffect(() => {
    setValueIsEmpty(value == null || value === '')
  }, [value])

  // If this is not a controlled element, we'll need to listen to `input`
  // events.
  useEffect(() => {
    if (inputEl == null) {
      return
    }

    const handler = (event: Event): void => {
      if (value !== undefined) {
        return
      }

      if (event.target == null || !('value' in event.target)) {
        return
      }

      const inputValue = event.target.value
      if (value === undefined) {
        setValueIsEmpty(inputValue === '')
      }
    }

    inputEl.addEventListener('input', handler)

    return () => {
      inputEl.removeEventListener('input', handler)
    }
  }, [inputEl, value])

  return valueIsEmpty
}
