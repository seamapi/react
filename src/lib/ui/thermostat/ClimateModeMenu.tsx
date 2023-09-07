import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import { OffIcon } from 'lib/icons/Off.js'
import { ThermostatCoolIcon } from 'lib/icons/ThermostatCool.js'
import { ThermostatHeatIcon } from 'lib/icons/ThermostatHeat.js'
import { ThermostatHeatCoolIcon } from 'lib/icons/ThermostatHeatCool.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { ThermoModeMenuOption } from 'lib/ui/thermostat/ThermoModeMenuOption.js'

const modes = ['heat', 'cool', 'heatcool', 'off'] as const
type Mode = (typeof modes)[number]

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
      {modes.map((m) => (
        <ThermoModeMenuOption
          key={m}
          label={t[m]}
          icon={getModeIcon(m)}
          isSelected={mode === m}
          onClick={() => {
            onChange(m)
          }}
        />
      ))}
    </Menu>
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
