import type { HvacModeSetting } from 'seamapi'

import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import { OffIcon } from 'lib/icons/Off.js'
import { ThermostatCoolIcon } from 'lib/icons/ThermostatCool.js'
import { ThermostatHeatIcon } from 'lib/icons/ThermostatHeat.js'
import { ThermostatHeatCoolIcon } from 'lib/icons/ThermostatHeatCool.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { ThermoModeMenuOption } from 'lib/ui/thermostat/ThermoModeMenuOption.js'

const modes: HvacModeSetting[] = ['heat', 'cool', 'heat_cool', 'off']

interface ClimateModeMenuProps {
  mode: HvacModeSetting
  onChange: (mode: HvacModeSetting) => void
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
            <ModeIcon mode={mode} />
          </div>
          <ChevronDownIcon />
        </button>
      )}
      verticalOffset={-180}
      horizontalOffset={-32}
      backgroundProps={{
        className: 'seam-thermo-mode-menu',
      }}
    >
      {modes.map((m) => (
        <ThermoModeMenuOption
          key={m}
          label={t[m]}
          icon={<ModeIcon mode={m} />}
          isSelected={mode === m}
          onClick={() => {
            onChange(m)
          }}
        />
      ))}
    </Menu>
  )
}

function ModeIcon(props: { mode: HvacModeSetting }): JSX.Element {
  switch (props.mode) {
    case 'heat':
      return <ThermostatHeatIcon />
    case 'cool':
      return <ThermostatCoolIcon />
    case 'heat_cool':
      return <ThermostatHeatCoolIcon />
    case 'off':
      return <OffIcon />
  }
}

const t = {
  heat: 'Heat',
  cool: 'Cool',
  heat_cool: 'Heat & Cool',
  off: 'Off',
}
