import { useRef } from 'react'

import { RadioCheckedIcon } from 'lib/icons/RadioChecked.js'
import { RadioUncheckedIcon } from 'lib/icons/RadioUnchecked.js'
import { useRadioField } from 'lib/ui/RadioField/RadioField.js'

export interface RadioProps<Value extends string> {
  value: Value
  label: string
}

export function Radio<Value extends string>({
  value,
  label,
}: RadioProps<Value>): JSX.Element {
  const { value: fieldValue, onChange, name } = useRadioField<Value>()

  const checked = fieldValue === value

  const inputRef = useRef<HTMLInputElement>()

  const checkRadio = (): void => {
    if (inputRef.current != null) {
      inputRef.current.click()
    }
  }

  return (
    <label className='seam-radio' onClick={checkRadio}>
      <span className='seam-radio-icon'>
        {checked ? <RadioCheckedIcon /> : <RadioUncheckedIcon />}
      </span>
      <input
        type='radio'
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => {
          onChange(event.target.value as Value)
        }}
      />
      <span className='seam-radio-label'>{label}</span>
    </label>
  )
}
