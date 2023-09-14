import { useEffect, useState } from 'react'

import {
  getBrowserTimezone,
  getTimezoneLabel,
  getTimezoneOffset,
  getTimezones,
} from 'lib/dates.js'
import { Checkbox } from 'lib/ui/Checkbox.js'
import { handleString } from 'lib/ui/TextField/TextField.js'

interface TimezonePickerProps {
  value: string
  onChange: (timezone: string) => void
  onManualTimezoneSelected: (manualTimezoneSelected: boolean) => void
}

export function TimezonePicker({
  onChange,
  value,
  onManualTimezoneSelected,
}: TimezonePickerProps): JSX.Element {
  const [manualTimezoneEnabled, setManualTimezoneEnabled] = useState(false)

  const isBrowserTimezoneSelected = value === getBrowserTimezone()
  const isManualTimezoneSelected =
    !isBrowserTimezoneSelected || manualTimezoneEnabled

  useEffect(() => {
    if (onManualTimezoneSelected != null)
      onManualTimezoneSelected(isManualTimezoneSelected)
  }, [isManualTimezoneSelected, onManualTimezoneSelected])

  const handleChangeManualTimezone = (enabled: boolean): void => {
    setManualTimezoneEnabled(enabled)
    if (!enabled) {
      onChange(getBrowserTimezone())
    }
  }

  return (
    <div className='seam-timezone-picker'>
      <Checkbox
        label={t.useLocalTimezoneLabel}
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
        {getTimezones().map((timezone) => (
          <option value={timezone} key={timezone}>
            {t.utc} {getTimezoneOffset(timezone)} {getTimezoneLabel(timezone)}
          </option>
        ))}
      </select>
    </div>
  )
}

const t = {
  utc: 'UTC',
  useLocalTimezoneLabel: 'Use local time zone',
}
