import { useRef } from 'react'

import { CheckboxBlankIcon } from 'lib/icons/CheckboxBlank.js'
import { CheckboxFilledIcon } from 'lib/icons/CheckboxFilled.js'

interface CheckboxProps {
  label: string
  checked?: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({
  label,
  checked,
  onChange,
}: CheckboxProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

  const toggle = (): void => {
    if (inputRef.current != null) {
      inputRef.current.click()
    }
  }

  return (
    <div className='seam-checkbox' onClick={toggle}>
      <span className='seam-checkbox-icon'>
        {checked === true ? <CheckboxFilledIcon /> : <CheckboxBlankIcon />}
      </span>
      <input
        type='checkbox'
        ref={inputRef}
        onChange={(event) => {
          onChange(event.target.checked)
        }}
        checked={checked}
      />
      <span className=' seam-checkbox-label'>{label}</span>
    </div>
  )
}
