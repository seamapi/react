import type { ChangeEvent, InputHTMLAttributes } from 'react'

export type TextFieldProps = {
  value?: string
  onChange: (value: string) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>

export default function TextField(props: TextFieldProps) {
  const { value, onChange, ...inputProps } = props
  return (
    <input
      className='seam--text-field'
      value={value}
      onChange={handleString(onChange)}
      type='text'
      {...inputProps}
    />
  )
}

export const handleString =
  (setter: (v: string) => void) =>
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setter(e.currentTarget.value)
  }
