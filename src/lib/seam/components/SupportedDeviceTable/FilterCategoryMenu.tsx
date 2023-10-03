import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'

export type FilterCategoryMenuProps =
  | FilterCategoryMenuPropsWithAllOption
  | FilterCategoryMenuPropsWithoutAllOption

interface FilterCategoryMenuPropsWithAllOption
  extends FilterCategoryMenuBaseProps {
  hideAllOption?: false
  allLabel: string
  onAllOptionSelect: () => void
}

interface FilterCategoryMenuPropsWithoutAllOption
  extends FilterCategoryMenuBaseProps {
  hideAllOption: true
  allLabel: never
  onAllOptionSelect?: never
}

interface FilterCategoryMenuBaseProps {
  label: string
  options: string[]
  onSelect: (option: string) => void
  buttonLabel?: string
}

export function FilterCategoryMenu({
  label = t.filter,
  allLabel,
  options,
  hideAllOption = false,
  onSelect,
  onAllOptionSelect,
  buttonLabel,
}: FilterCategoryMenuProps): JSX.Element {
  const sortedOptions = [...options].sort((a, b) => a.localeCompare(b))
  const usableOptions = hideAllOption
    ? sortedOptions
    : [allLabel, ...sortedOptions]

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
        <div className='seam-supported-device-table-filter-menu-content'>
          {usableOptions.map((option, index) => (
            <MenuItem
              key={`${index}:${option}`}
              onClick={() => {
                if (option === allLabel) {
                  onAllOptionSelect?.()
                } else {
                  onSelect(option)
                }
              }}
            >
              <span>{option}</span>
            </MenuItem>
          ))}
        </div>
      </Menu>
    </div>
  )
}

const t = {
  filter: 'Filter',
}
