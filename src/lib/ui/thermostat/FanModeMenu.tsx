import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import { FanIcon } from 'lib/icons/Fan.js'
import { FanOutlineIcon } from 'lib/icons/FanOutline.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { ThermoModeMenuOption } from 'lib/ui/thermostat/ThermoModeMenuOption.js'

const modes = ['auto', 'on'] as const
type Mode = (typeof modes)[number]

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
        className: 'seam-fan-mode-menu-bg seam-thermo-mode-menu',
      }}
    >
      {modes.map((m) => (
        <ThermoModeMenuOption
          key={m}
          label={t[m]}
          icon={<FanIcon />}
          isSelected={mode === m}
          onClick={() => {
            onChange(m)
          }}
        />
      ))}
    </Menu>
  )
}

const t = {
  auto: 'Auto',
  on: 'On',
}
