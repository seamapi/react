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
      hideAllOption?: false
      onAllOptionSelect: () => void
    })
  | (FilterCategoryMenuBaseProps & {
      hideAllOption: true
      onAllOptionSelect?: never
    })

export function FilterCategoryMenu({
  label = 'Filter',
  options,
  hideAllOption = false,
  onSelect,
  onAllOptionSelect,
  buttonLabel,
}: FilterCategoryMenuProps) {
  const usableOptions = hideAllOption ? options : ['All', ...options]

  return (
    <div className='seam-supported-device-table-filter-menu-wrap'>
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
