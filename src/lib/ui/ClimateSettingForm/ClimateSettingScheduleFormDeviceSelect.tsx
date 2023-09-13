import { Controller, type Control, type FieldValues } from 'react-hook-form'
import { ContentHeader } from '../layout/ContentHeader.js'
import { ThermostatSelect } from '../thermostat/ThermostatSelect.js'
import { t } from './ClimateSettingScheduleForm.js'

interface ClimateSettingScheduleFormDeviceSelectProps {
  control: Control<FieldValues, any>
  onSelect: () => void
  onBack: (() => void) | undefined
}

export function ClimateSettingScheduleFormDeviceSelect({
  control,
  onBack,
  onSelect,
}: ClimateSettingScheduleFormDeviceSelectProps): JSX.Element {
  return (
    <>
      <ContentHeader title={t.addNewClimateSettingSchedule} onBack={onBack} />
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
