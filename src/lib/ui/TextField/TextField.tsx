import classNames from 'classnames'
import type { ChangeEvent, InputHTMLAttributes } from 'react'

export type TextFieldProps = {
  value?: string
  onChange: (value: string) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>

export function TextField(props: TextFieldProps): JSX.Element {
  const { value, onChange, className, ...inputProps } = props
  return (
    <input
      className={classNames('seam-text-field', className)}
      value={value}
      onChange={handleString(onChange)}
      type='text'
      {...inputProps}
    />
  )
}

export const handleString =
  (setter: (v: string) => void) =>
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setter(event.currentTarget.value)
  }
