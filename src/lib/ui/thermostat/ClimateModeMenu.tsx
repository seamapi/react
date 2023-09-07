import { CheckBlackIcon } from 'lib/icons/CheckBlack.js'
import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import { OffIcon } from 'lib/icons/Off.js'
import { ThermostatCoolIcon } from 'lib/icons/ThermostatCool.js'
import { ThermostatHeatIcon } from 'lib/icons/ThermostatHeat.js'
import { ThermostatHeatCoolIcon } from 'lib/icons/ThermostatHeatCool.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'

type Mode = 'heat' | 'cool' | 'heatcool' | 'off'

interface ClimateModeMenuProps {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function ClimateModeMenu({
  mode,
  onChange,
}: ClimateModeMenuProps): JSX.Element {
  return (
    <Menu
      renderButton={({ onOpen }) => (
        <button onClick={onOpen} className='seam-climate-mode-menu-button'>
          <div className='seam-climate-mode-menu-button-icon'>
            {getModeIcon(mode)}
          </div>
          <ChevronDownIcon />
        </button>
      )}
      verticalOffset={-180}
      horizontalOffset={-32}
      backgroundProps={{
        className: 'seam-climate-mode-menu-bg seam-thermo-mode-menu',
      }}
    >
      <Option
        mode='heat'
        isSelected={mode === 'heat'}
        onClick={() => {
          onChange('heat')
        }}
      />
      <Option
        mode='cool'
        isSelected={mode === 'cool'}
        onClick={() => {
          onChange('cool')
        }}
      />
      <Option
        mode='heatcool'
        isSelected={mode === 'heatcool'}
        onClick={() => {
          onChange('heatcool')
        }}
      />
      <Option
        mode='off'
        isSelected={mode === 'off'}
        onClick={() => {
          onChange('off')
        }}
      />
    </Menu>
  )
}

interface OptionProps {
  mode: Mode
  onClick: () => void
  isSelected: boolean
}

function Option({ mode, isSelected, onClick }: OptionProps): JSX.Element {
  return (
    <MenuItem onClick={onClick}>
      <div className='seam-thermo-mode-menu-item'>
        <div className='seam-thermo-mode-menu-item-block'>
          {getModeIcon(mode)}
          <span>{t[mode]}</span>
        </div>
        <div className='seam-thermo-mode-menu-item-block'>
          {isSelected && <CheckBlackIcon />}
        </div>
      </div>
    </MenuItem>
  )
}

function getModeIcon(mode: Mode): JSX.Element {
  switch (mode) {
    case 'heat':
      return <ThermostatHeatIcon />
    case 'cool':
      return <ThermostatCoolIcon />
    case 'heatcool':
      return <ThermostatHeatCoolIcon />
    case 'off':
      return <OffIcon />
  }
}

const t = {
  heat: 'Heat',
  cool: 'Cool',
  heatcool: 'Heat & Cool',
  off: 'Off',
}
