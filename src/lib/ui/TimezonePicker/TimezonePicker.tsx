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
  onIsManualTimezoneChanged?: (isManualTimezone: boolean) => void
}

export function TimezonePicker({
  onChange,
  value,
  onIsManualTimezoneChanged,
}: TimezonePickerProps): JSX.Element {
  const [manualTimezoneEnabled, setManualTimezoneEnabled] = useState(false)

  const isBrowserTimezone = value === getBrowserTimezone()
  const isManualTimezone = !isBrowserTimezone || manualTimezoneEnabled

  useEffect(() => {
    if (onIsManualTimezoneChanged) onIsManualTimezoneChanged(isManualTimezone)
  }, [isManualTimezone, onIsManualTimezoneChanged])

  const handleChangeManualTimezone = (enabled: boolean): void => {
    setManualTimezoneEnabled(enabled)
    if (!enabled) {
      onChange(getBrowserTimezone())
    }
  }

  return (
    <div className='seam-timezone-picker'>
      <Checkbox
        label={t.setTimezoneManuallyLabel}
        checked={!isManualTimezone}
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
  titleAuto: 'Time Zone (automatic)',
  titleManual: 'Time Zone (manual)',
  utc: 'UTC',
  setTimezoneManuallyLabel: 'Use local time zone',
}
