import Menu from 'lib/ui/Menu/Menu.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'

interface FilterCategoryMenuProps {
  label: string
  options: string[]
  onSelect: (option: string) => void
}

export default function FilterCategoryMenu({
  label,
  options,
  onSelect,
}: FilterCategoryMenuProps) {
  return (
    <div className='seam-supported-devices-filter-menu-wrap'>
      <p>{label}</p>
      <Menu button={({ open }) => <button onClick={open}>Filter</button>}>
        {options.map((option) => (
          <MenuItem onClick={() => onSelect(option)}>
            <span>{option}</span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
