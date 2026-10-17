import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import type { FilterOption } from 'lib/seam/components/SupportedDevices/device-models.js'

interface FilterSelectProps {
  label: string
  allLabel: string
  options: FilterOption[]
  value: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
}

export function FilterSelect({
  label,
  allLabel,
  options,
  value,
  onChange,
  disabled = false,
}: FilterSelectProps): JSX.Element {
  return (
    <label className='seam-ecosystem-select'>
      <span className='seam-ecosystem-visually-hidden'>{label}</span>
      <select
        className='seam-ecosystem-select-input'
        value={value ?? ''}
        disabled={disabled}
        onChange={(event) => {
          const { value } = event.target
          onChange(value.length === 0 ? null : value)
        }}
      >
        <option value=''>{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon aria-hidden className='seam-ecosystem-select-icon' />
    </label>
  )
}
