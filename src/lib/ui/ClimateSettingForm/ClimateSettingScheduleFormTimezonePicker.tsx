import { useState } from 'react'
import { type Control, Controller } from 'react-hook-form'

import type { ClimateSettingScheduleFormFields } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleForm.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TimezonePicker } from 'lib/ui/TimezonePicker/TimezonePicker.js'

interface ClimateSettingScheduleFormTimezonePickerProps {
  control: Control<ClimateSettingScheduleFormFields>
  onClose: () => void
}

export function ClimateSettingScheduleFormTimezonePicker({
  control,
  onClose,
}: ClimateSettingScheduleFormTimezonePickerProps): JSX.Element {
  const [title, setTitle] = useState(t.titleAuto)

  return (
    <>
      <ContentHeader title={title} onBack={onClose} />
      <div className='seam-main'>
        <Controller
          name='timezone'
          control={control}
          render={({ field }) => (
            <TimezonePicker
              {...field}
              onManualTimezoneSelected={(manualTimezoneSelected) => {
                setTitle(manualTimezoneSelected ? t.titleManual : t.titleAuto)
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
