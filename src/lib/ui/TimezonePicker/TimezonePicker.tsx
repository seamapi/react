import { useEffect, useState } from 'react'

import {
  getSystemZone,
  getZoneLabel,
  getZoneOffset,
  getZoneNames,
} from 'lib/dates.js'
import { Checkbox } from 'lib/ui/Checkbox.js'
import { handleString } from 'lib/ui/TextField/TextField.js'

interface TimezonePickerProps {
  value: string
  onChange: (timezone: string) => void
  onManualTimezoneSelected?: (manualTimezoneSelected: boolean) => void
}

export function TimezonePicker({
  onChange,
  value,
  onManualTimezoneSelected,
}: TimezonePickerProps): JSX.Element {
  const [manualTimezoneEnabled, setManualTimezoneEnabled] = useState(false)

  const isBrowserTimezoneSelected = value === getSystemZone()
  const isManualTimezoneSelected =
    !isBrowserTimezoneSelected || manualTimezoneEnabled

  useEffect(() => {
    if (onManualTimezoneSelected != null)
      onManualTimezoneSelected(isManualTimezoneSelected)
  }, [isManualTimezoneSelected, onManualTimezoneSelected])

  const handleChangeManualTimezone = (enabled: boolean): void => {
    setManualTimezoneEnabled(enabled)
    if (!enabled) {
      onChange(getSystemZone())
    }
  }

  return (
    <div className='seam-timezone-picker'>
      <Checkbox
        label={t.setTimezoneManuallyLabel}
        checked={!isManualTimezoneSelected}
        onChange={(manual) => {
          handleChangeManualTimezone(!manual)
        }}
        className='seam-manual-timezone-checkbox'
      />

      <select
        value={value}
        onChange={handleString(onChange)}
        className='seam-timezone-select'
      >
        {getZoneNames().map((timezone) => (
          <option value={timezone} key={timezone}>
            {t.utc} {getZoneOffset(timezone)} {getZoneLabel(timezone)}
          </option>
        ))}
      </select>
    </div>
  )
}

const t = {
  utc: 'UTC',
  setTimezoneManuallyLabel: 'Use local time zone',
}
