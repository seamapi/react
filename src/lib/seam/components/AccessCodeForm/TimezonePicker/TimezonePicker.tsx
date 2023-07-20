import classNames from 'classnames'
import { useState } from 'react'

import {
  compareByTimezoneOffsetAsc,
  getBrowserTimezone,
  getTimezones,
} from 'lib/dates.js'
import { TimezoneListItem } from 'lib/seam/components/AccessCodeForm/TimezonePicker/TimezonePickerListItem.js'
import { Checkbox } from 'lib/ui/Checkbox.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

interface TimezonePickerProps {
  value: string
  onChange: (timezone: string) => void
  onClose: () => void
}

export function TimezonePicker({
  onChange,
  value,
  onClose,
}: TimezonePickerProps): JSX.Element {
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
          checked={isManualTimezone}
          onChange={handleChangeManualTimezone}
          className='seam-manual-timezone-checkbox'
        />
        <div
          className={classNames('seam-timezones', {
            'seam-disabled': !isManualTimezone,
          })}
        >
          <ul>
            {getTimezones()
              .sort(compareByTimezoneOffsetAsc)
              .map((timezone) => (
                <TimezoneListItem
                  key={timezone}
                  value={timezone}
                  isSelected={timezone === value}
                  onClick={() => {
                    onChange(timezone)
                  }}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const t = {
  titleAuto: 'Time Zone (automatic)',
  titleManual: 'Time Zone (manual)',
  setTimezoneManuallyLabel: 'Set time zone manually',
}
