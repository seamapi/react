import { CheckBlackIcon } from 'lib/icons/CheckBlack.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'

interface ThermoModeMenuOptionProps {
  label: string
  icon: JSX.Element
  onClick: () => void
  isSelected: boolean
}

export function ThermoModeMenuOption({
  label,
  icon,
  isSelected,
  onClick,
}: ThermoModeMenuOptionProps): JSX.Element {
  return (
    <MenuItem onClick={onClick}>
      <div className='seam-thermo-mode-menu-item'>
        <div className='seam-thermo-mode-menu-item-block'>
          <div className='seam-thermo-mode-menu-icon'>{icon}</div>
          <span>{label}</span>
        </div>
        <div className='seam-thermo-mode-menu-item-block'>
          {isSelected && <CheckBlackIcon />}
        </div>
      </div>
    </MenuItem>
  )
}
