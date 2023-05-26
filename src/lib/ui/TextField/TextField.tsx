import classNames from 'classnames'
import type { ChangeEvent, InputHTMLAttributes, MutableRefObject } from 'react'

export interface TextFieldProps {
  value?: string
  onChange?: (value: string) => void
  startAdornment?: JSX.Element
  endAdornment?: JSX.Element
  className?: string
  inputProps?: {
    ref?:
      | MutableRefObject<HTMLInputElement | null>
      | ((inputEl: HTMLInputElement) => void)
  } & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>
}

export function TextField(props: TextFieldProps): JSX.Element {
  const {
    value,
    onChange,
    className,
    startAdornment,
    endAdornment,
    inputProps,
  } = props

  return (
    <div className={classNames('seam-text-field', className)}>
      {startAdornment != null && (
        <div className='seam-adornment seam-start'>{startAdornment}</div>
      )}
      <input
        className='seam-text-field-input'
        value={value}
        onChange={onChange == null ? undefined : handleString(onChange)}
        type='text'
        {...inputProps}
      />
      {endAdornment != null && (
        <div className='seam-adornment seam-end'>{endAdornment}</div>
      )}
    </div>
  )
}

export const handleString =
  (setter: (v: string) => void) =>
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setter(event.currentTarget.value)
  }
