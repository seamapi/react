import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import Menu from 'lib/ui/Menu/Menu.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'

interface FilterCategoryMenuProps {
  label: string
  options: string[]
  addAllOption?: boolean
  onSelect: (option: string) => void
  onAllOptionSelect?: () => void
  buttonLabel?: string
}

export default function FilterCategoryMenu({
  label,
  options,
  addAllOption,
  onSelect,
  onAllOptionSelect,
  buttonLabel,
}: FilterCategoryMenuProps) {
  const usableOptions = addAllOption ? ['All', ...options] : options

  if (Boolean(addAllOption) && onAllOptionSelect == null) {
    throw new Error(
      'onAllOptionSelect must be provided if addAllOption is true'
    )
  }

  return (
    <div className='seam-supported-devices-filter-menu-wrap'>
      <p>{label}</p>
      <Menu
        button={({ open }) => (
          <button onClick={open}>
            <span>{buttonLabel}</span>
            <ChevronDownIcon />
          </button>
        )}
      >
        {usableOptions.map((option, index) => (
          <MenuItem
            key={`${index}:${option}`}
            onClick={() => {
              if (option === 'All') {
                onAllOptionSelect?.()
              } else {
                onSelect(option)
              }
            }}
          >
            <span>{option}</span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

FilterCategoryMenu.defaultProps = {
  addAllOption: true,
  buttonLabel: 'Filter',
}
