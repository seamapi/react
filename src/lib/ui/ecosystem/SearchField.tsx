import { SearchIcon } from 'lib/icons/Search.js'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
  disabled?: boolean
}

export function SearchField({
  value,
  onChange,
  label,
  disabled = false,
}: SearchFieldProps): JSX.Element {
  return (
    <label className='seam-ecosystem-search'>
      <SearchIcon aria-hidden className='seam-ecosystem-search-icon' />
      <input
        type='search'
        className='seam-ecosystem-search-input'
        placeholder={label}
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
    </label>
  )
}
