import classNames from 'classnames'
import type { CSSProperties } from 'react'

import { ChevronDownIcon } from 'lib/icons/ChevronDown.js'
import { OffIcon } from 'lib/icons/Off.js'
import { ThermostatCoolIcon } from 'lib/icons/ThermostatCool.js'
import { ThermostatHeatIcon } from 'lib/icons/ThermostatHeat.js'
import { ThermostatHeatCoolIcon } from 'lib/icons/ThermostatHeatCool.js'
import type { HvacModeSetting } from 'lib/seam/thermostats/thermostat-device.js'
import { Menu } from 'lib/ui/Menu/Menu.js'
import { ThermoModeMenuOption } from 'lib/ui/thermostat/ThermoModeMenuOption.js'

interface ClimateModeMenuProps {
  mode: HvacModeSetting
  onChange: (mode: HvacModeSetting) => void
  supportedModes?: HvacModeSetting[]
  buttonTextVisible?: boolean
  className?: string
  style?: CSSProperties
  block?: boolean
  size?: 'regular' | 'large'
}

export function ClimateModeMenu({
  mode,
  onChange,
  supportedModes = ['heat', 'cool', 'heat_cool', 'off'],
  buttonTextVisible = false,
  className,
  style,
  block,
  size = 'regular',
}: ClimateModeMenuProps): JSX.Element {
  return (
    <Menu
      renderButton={({ onOpen }) => (
        <button
          style={style}
          onClick={onOpen}
          className={classNames(
            'seam-climate-mode-menu-button',
            {
              'seam-climate-mode-menu-button-block': block,
              'seam-climate-mode-menu-button-regular': size === 'regular',
              'seam-climate-mode-menu-button-large': size === 'large',
            },
            className
          )}
        >
          <div className='seam-climate-mode-menu-button-icon'>
            <ModeIcon mode={mode} />
          </div>

          {buttonTextVisible && (
            <span className='seam-climate-mode-menu-button-text'>
              {t[mode]}
            </span>
          )}

          <ChevronDownIcon className='seam-climate-mode-menu-button-chevron' />
        </button>
      )}
      verticalOffset={-180}
      horizontalOffset={-32}
      backgroundProps={{
        className: 'seam-thermo-mode-menu',
      }}
    >
      {supportedModes.map((m) => (
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
