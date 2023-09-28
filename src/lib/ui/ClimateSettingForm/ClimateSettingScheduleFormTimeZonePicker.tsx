import { useState } from 'react'
import { type Control, Controller } from 'react-hook-form'

import type { ClimateSettingScheduleFormFields } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleForm.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TimeZonePicker } from 'lib/ui/TimeZonePicker/TimeZonePicker.js'

interface ClimateSettingScheduleFormTimeZonePickerProps {
  control: Control<ClimateSettingScheduleFormFields>
  onClose: () => void
}

export function ClimateSettingScheduleFormTimeZonePicker({
  control,
  onClose,
}: ClimateSettingScheduleFormTimeZonePickerProps): JSX.Element {
  const [title, setTitle] = useState(t.titleAuto)

  return (
    <>
      <ContentHeader title={title} onBack={onClose} />
      <div className='seam-main'>
        <Controller
          name='timeZone'
          control={control}
          render={({ field }) => (
            <TimeZonePicker
              {...field}
              onManualTimeZoneSelected={(manualTimeZoneSelected) => {
                setTitle(manualTimeZoneSelected ? t.titleManual : t.titleAuto)
              }}
            />
          )}
        />
      </div>
    </>
  )
}

const t = {
  titleAuto: 'Time Zone (automatic)',
  titleManual: 'Time Zone (manual)',
}
