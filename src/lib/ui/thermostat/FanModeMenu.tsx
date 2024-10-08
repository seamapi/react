import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import { FanIcon } from 'lib/icons/Fan.js'
import { FanOutlineIcon } from 'lib/icons/FanOutline.js'
import type { FanModeSetting } from 'lib/seam/thermostats/thermostat-device.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { ThermoModeMenuOption } from 'lib/ui/thermostat/ThermoModeMenuOption.js'

const modes: FanModeSetting[] = ['auto', 'on']

interface FanModeMenuProps {
  mode: FanModeSetting
  onChange: (mode: FanModeSetting) => void
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
      horizontalOffset={-20}
      backgroundProps={{
        className: 'seam-thermo-mode-menu',
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
  circulate: 'Circulate',
}
