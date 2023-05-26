import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import Menu from 'lib/ui/Menu/Menu.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'

interface FilterCategoryMenuProps {
  label: string
  options: string[]
  onSelect: (option: string) => void
  buttonLabel?: string
}

export default function FilterCategoryMenu({
  label,
  options,
  onSelect,
  buttonLabel,
}: FilterCategoryMenuProps) {
  return (
    <div className='seam-supported-devices-filter-menu-wrap'>
      <p>{label}</p>
      <Menu
        button={({ open }) => (
          <button onClick={open}>
            <span>{buttonLabel ?? 'Filter'}</span>
            <ChevronDownIcon />
          </button>
        )}
      >
        {options.map((option) => (
          <MenuItem onClick={() => onSelect(option)}>
            <span>{option}</span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
