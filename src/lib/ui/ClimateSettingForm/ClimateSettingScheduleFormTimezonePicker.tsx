import { useState } from 'react'

import {
  getBrowserTimezone,
  getTimezoneLabel,
  getTimezoneOffset,
  getTimezones,
} from 'lib/dates.js'
import { Checkbox } from 'lib/ui/Checkbox.js'
import type { ClimateSettingScheduleFormFields } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleForm.js'
import { handleString } from 'lib/ui/TextField/TextField.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { Controller, type Control } from 'react-hook-form'

interface ClimateSettingScheduleFormTimezonePickerProps {
  control: Control<ClimateSettingScheduleFormFields>
  onClose: () => void
}

export function ClimateSettingScheduleFormTimezonePicker({
  control,
  onClose,
}: ClimateSettingScheduleFormTimezonePickerProps): JSX.Element {
  const [manualTimezoneEnabled, setManualTimezoneEnabled] = useState(false)

  return (
    <Controller
      name='timezone'
      control={control}
      render={({ field: { onChange, value } }) => {
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
          <>
            <ContentHeader title={title} onBack={onClose} />
            <div className='seam-main'>
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
                      {t.utc} {getTimezoneOffset(timezone)}{' '}
                      {getTimezoneLabel(timezone)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )
      }}
    />
  )
}

const t = {
  titleAuto: 'Time Zone (automatic)',
  titleManual: 'Time Zone (manual)',
  utc: 'UTC',
  setTimezoneManuallyLabel: 'Use local time zone',
}
