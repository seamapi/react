import { useState } from 'react'

import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TimeZonePicker } from 'lib/ui/TimeZonePicker/TimeZonePicker.js'

interface AccessCodeFormTimeZonePickerProps {
  value: string
  onChange: (timeZone: string) => void
  onClose: () => void
}

export function AccessCodeFormTimeZonePicker({
  onChange,
  value,
  onClose,
}: AccessCodeFormTimeZonePickerProps): JSX.Element {
  const [title, setTitle] = useState(t.titleAuto)

  return (
    <div className='seam-access-code-time-zone-picker'>
      <ContentHeader title={title} onBack={onClose} />
      <div className='seam-content'>
        <TimeZonePicker
          value={value}
          onChange={onChange}
          onManualTimeZoneSelected={(manualTimeZoneSelected) => {
            setTitle(manualTimeZoneSelected ? t.titleManual : t.titleAuto)
          }}
        />
      </div>
    </div>
  )
}

const t = {
  titleAuto: 'Time Zone (automatic)',
  titleManual: 'Time Zone (manual)',
  utc: 'UTC',
  setTimeZoneManuallyLabel: 'Use local time zone',
}
