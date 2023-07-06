import classNames from 'classnames'
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type MutableRefObject,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

import { CloseIcon } from 'lib/icons/Close.js'

export interface TextFieldProps {
  value?: string
  onChange?: (value: string) => void
  startAdornment?: JSX.Element
  endAdornment?: JSX.Element
  disabled?: boolean
  className?: string
  size?: 'small' | 'large'
  inputProps?: {
    ref?:
      | MutableRefObject<HTMLInputElement | null>
      | ((inputEl: HTMLInputElement) => void)
  } & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>
  clearable?: boolean
  error?: string
}

export const TextField = forwardRef<
  HTMLInputElement | undefined,
  TextFieldProps
>(function TextField(
  {
    value,
    onChange,
    className,
    startAdornment,
    endAdornment,
    inputProps,
    disabled = false,
    size = 'small',
    clearable = false,
    error,
  },
  ref
): JSX.Element {
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

  // Maintain a local ref, and still forward it along
  useImperativeHandle(ref, () => (inputEl != null ? inputEl : undefined), [
    inputEl,
  ])

  const endAdornmentVisible = endAdornment != null || clearable

  return (
    <div
      className={classNames('seam-text-field', className, `seam-${size}`, {
        'seam-disabled': disabled,
        'seam-error': error != null,
      })}
    >
      <div className='seam-main'>
        {startAdornment != null && (
          <div className='seam-adornment seam-start'>{startAdornment}</div>
        )}
        <input
          className='seam-text-field-input'
          value={value}
          onChange={onChange == null ? undefined : handleString(onChange)}
          type='text'
          disabled={disabled}
          ref={setInputEl}
          {...inputProps}
        />
        {endAdornmentVisible && (
          <div className='seam-adornment seam-end'>
            {clearable && (
              <button
                className={classNames({
                  'seam-hidden': valueIsEmpty,
                })}
                onClick={clearInput}
              >
                <CloseIcon />
              </button>
            )}
            {endAdornment}
          </div>
        )}
      </div>
      {error != null && <div className='seam-helper-text'>{error}</div>}
    </div>
  )
})

export const handleString =
  (setter: (v: string) => void) =>
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setter(event.currentTarget.value)
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
