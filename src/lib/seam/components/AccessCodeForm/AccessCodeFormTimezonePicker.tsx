import { useState } from 'react'

import {
  getBrowserTimezone,
  getTimezoneLabel,
  getTimezoneOffset,
  getTimezones,
} from 'lib/dates.js'
import { Checkbox } from 'lib/ui/Checkbox.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { handleString } from 'lib/ui/TextField/TextField.js'

interface AccessCodeFormTimezonePickerProps {
  value: string
  onChange: (timezone: string) => void
  onClose: () => void
}

export function AccessCodeFormTimezonePicker({
  onChange,
  value,
  onClose,
}: AccessCodeFormTimezonePickerProps): JSX.Element {
  const [manualTimezoneEnabled, setManualTimezoneEnabled] = useState(false)

  const isBrowserTimezone = value === getBrowserTimezone()
  const isManualTimezone = !isBrowserTimezone || manualTimezoneEnabled

  const handleChangeManualTimezone = (enabled: boolean): void => {
    setManualTimezoneEnabled(enabled)
    if (!enabled) {
      onChange(getBrowserTimezone())
    }
  }

  const title = isManualTimezone ? t.titleManual : t.titleAuto

  return (
    <div className='seam-timezone-picker'>
      <ContentHeader title={title} onBack={onClose} />
      <div className='seam-content'>
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
          disabled={!isManualTimezone}
        >
          {getTimezones().map((timezone) => (
            <option value={timezone} key={timezone}>
              UTC {getTimezoneOffset(timezone)} {getTimezoneLabel(timezone)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

const t = {
  titleAuto: 'Time Zone (automatic)',
  titleManual: 'Time Zone (manual)',
  setTimezoneManuallyLabel: 'Set time zone automatically',
}
