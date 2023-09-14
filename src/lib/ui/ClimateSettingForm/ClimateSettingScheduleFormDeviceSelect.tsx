import { type Control, Controller, type FieldValues } from 'react-hook-form'
import { ThermostatSelect } from 'lib/ui/thermostat/ThermostatSelect.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

interface ClimateSettingScheduleFormDeviceSelectProps {
  title: string
  control: Control<FieldValues, any>
  onSelect: () => void
  onBack: (() => void) | undefined
}

export function ClimateSettingScheduleFormDeviceSelect({
  title,
  control,
  onBack,
  onSelect,
}: ClimateSettingScheduleFormDeviceSelectProps): JSX.Element {
  return (
    <>
      <ContentHeader title={title} onBack={onBack} />
      <div className='seam-main'>
        <Controller
          name='deviceId'
          control={control}
          render={({ field: { onChange } }) => (
            <ThermostatSelect
              onSelect={(deviceId) => {
                onChange(deviceId)
                onSelect()
              }}
            />
          )}
        />
      </div>
    </>
  )
}
