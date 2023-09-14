import { useState } from 'react'

import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TimezonePicker } from 'lib/ui/TimezonePicker/TimezonePicker.js'

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
  const [title, setTitle] = useState(t.titleAuto)

  return (
    <div className='seam-access-code-timezone-picker'>
      <ContentHeader title={title} onBack={onClose} />
      <div className='seam-content'>
        <TimezonePicker
          value={value}
          onChange={onChange}
          onIsManualTimezoneChanged={(isManualTimezone) =>
            { setTitle(isManualTimezone ? t.titleManual : t.titleAuto); }
          }
        />
      </div>
    </div>
  )
}

const t = {
  titleAuto: 'Time Zone (automatic)',
  titleManual: 'Time Zone (manual)',
  utc: 'UTC',
  setTimezoneManuallyLabel: 'Use local time zone',
}
