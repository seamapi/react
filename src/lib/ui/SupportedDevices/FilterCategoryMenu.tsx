import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'

interface FilterCategoryMenuBaseProps {
  label: string
  options: string[]
  onSelect: (option: string) => void
  buttonLabel?: string
}

export type FilterCategoryMenuProps =
  | (FilterCategoryMenuBaseProps & {
      addAllOption: true
      onAllOptionSelect: () => void
    })
  | (FilterCategoryMenuBaseProps & {
      addAllOption?: false
      onAllOptionSelect?: never
    })

export function FilterCategoryMenu({
  label,
  options,
  addAllOption,
  onSelect,
  onAllOptionSelect,
  buttonLabel,
}: FilterCategoryMenuProps) {
  const usableOptions = addAllOption ? ['All', ...options] : options

  return (
    <div className='seam-supported-devices-filter-menu-wrap'>
      <p>{label}</p>
      <Menu
        renderButton={({ onOpen }) => (
          <button onClick={onOpen}>
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
