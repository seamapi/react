import { useEffect, useState } from 'react'

import {
  getSystemZone,
  getZoneLabel,
  getZoneNames,
  getZoneOffset,
} from 'lib/dates.js'
import { Checkbox } from 'lib/ui/Checkbox.js'
import { handleString } from 'lib/ui/TextField/TextField.js'

interface TimeZonePickerProps {
  value: string
  onChange: (timeZone: string) => void
  onManualTimeZoneSelected?: (manualTimeZoneSelected: boolean) => void
}

export function TimeZonePicker({
  onChange,
  value,
  onManualTimeZoneSelected,
}: TimeZonePickerProps): JSX.Element {
  const [manualTimeZoneEnabled, setManualTimeZoneEnabled] = useState(false)

  const isBrowserTimeZoneSelected = value === getSystemZone()
  const isManualTimeZoneSelected =
    !isBrowserTimeZoneSelected || manualTimeZoneEnabled

  useEffect(() => {
    if (onManualTimeZoneSelected != null)
      onManualTimeZoneSelected(isManualTimeZoneSelected)
  }, [isManualTimeZoneSelected, onManualTimeZoneSelected])

  const handleChangeManualTimeZone = (enabled: boolean): void => {
    setManualTimeZoneEnabled(enabled)
    if (!enabled) {
      onChange(getSystemZone())
    }
  }

  return (
    <div className='seam-time-zone-picker'>
      <Checkbox
        label={t.setTimeZoneManuallyLabel}
        checked={!isManualTimeZoneSelected}
        onChange={(manual) => {
          handleChangeManualTimeZone(!manual)
        }}
        className='seam-manual-time-zone-checkbox'
      />

      <select
        value={value}
        onChange={handleString(onChange)}
        className='seam-time-zone-select'
      >
        {getZoneNames().map((timeZone) => (
          <option value={timeZone} key={timeZone}>
            {t.utc} {getZoneOffset(timeZone)} {getZoneLabel(timeZone)}
          </option>
        ))}
      </select>
    </div>
  )
}

const t = {
  utc: 'UTC',
  setTimeZoneManuallyLabel: 'Use local time zone',
}
