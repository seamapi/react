
import { CheckBlackIcon } from 'lib/icons/CheckBlack.js'
import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import { FanIcon } from 'lib/icons/Fan.js'
import { FanOutlineIcon } from 'lib/icons/FanOutline.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'

type Mode = 'auto' | 'on'

interface FanModeMenuProps {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function FanModeMenu({ mode, onChange }: FanModeMenuProps): JSX.Element {
  return (
    <Menu
      renderButton={({ onOpen }) => (
        <button onClick={onOpen} className='seam-fan-mode-menu-button'>
          <div className='seam-fan-mode-menu-button-block'>
            <FanOutlineIcon />
            <span className='seam-fan-mode-menu-button-text'>
              {mode === 'auto' ? t.auto : t.on}
            </span>
          </div>
          <ChevronDownIcon />
        </button>
      )}
      verticalOffset={-180}
      horizontalOffset={-32}
      backgroundProps={{
        className: 'seam-fan-mode-menu-bg',
      }}
    >
      <Option
        mode='auto'
        isSelected={mode === 'auto'}
        onClick={() => { onChange('auto'); }}
      />
      <Option
        mode='on'
        isSelected={mode === 'on'}
        onClick={() => { onChange('on'); }}
      />
    </Menu>
  )
}

interface OptionProps {
  mode: Mode
  isSelected: boolean
  onClick: () => void
}

function Option({ mode, isSelected, onClick }: OptionProps) {
  return (
    <MenuItem onClick={onClick}>
      <div className='seam-fan-mode-menu-item'>
        <div className='seam-fan-mode-menu-item-block'>
          <FanIcon />
          <span>{mode === 'auto' ? t.auto : t.on}</span>
        </div>
        <div className='seam-fan-mode-menu-item-block'>
          {isSelected && <CheckBlackIcon />}
        </div>
      </div>
    </MenuItem>
  )
}

const t = {
  auto: 'Auto',
  on: 'On',
}
