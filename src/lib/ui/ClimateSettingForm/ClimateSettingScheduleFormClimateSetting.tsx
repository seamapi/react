import { type Control, Controller } from 'react-hook-form'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import type { ClimateSettingScheduleFormFields } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleForm.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { ClimateSettingControlGroup } from 'lib/ui/thermostat/ClimateSettingControlGroup.js'

interface ClimateSettingScheduleFormClimateSettingProps {
  title: string
  control: Control<ClimateSettingScheduleFormFields>
  deviceId: string
  onBack: () => void
  onCancel: (() => void) | undefined
  onSave: () => void
}

export function ClimateSettingScheduleFormClimateSetting({
  title,
  control,
  deviceId,
  onBack,
  onCancel,
  onSave,
}: ClimateSettingScheduleFormClimateSettingProps): JSX.Element {
  const { device } = useDevice({
    device_id: deviceId,
  })

  return (
    <>
      <ContentHeader
        title={title}
        onBack={onBack}
        subheading={device?.properties.name}
      />
      <div className='seam-main'>
        <div className='seam-climate-setting-schedule-form-climate-setting'>
          <div className='seam-content'>
            <div>
              <InputLabel>{t.climateSetting}</InputLabel>
              <span className='seam-label'>{t.climateSettingSubHeading}</span>
            </div>
            <FormField>
              <Controller
                name='climateSetting'
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <ClimateSettingControlGroup
                      mode={value.hvacModeSetting}
                      onModeChange={(mode) => {
                        onChange({ ...value, hvacModeSetting: mode })
                      }}
                      coolValue={value.coolingSetPoint}
                      heatValue={value.heatingSetPoint}
                      delta={5}
                      maxCool={90}
                      maxHeat={100}
                      minCool={50}
                      minHeat={70}
                      onCoolValueChange={(coolingSetPoint) => {
                        onChange({
                          ...value,
                          coolingSetPoint,
                        })
                      }}
                      onHeatValueChange={(heatingSetPoint) => {
                        onChange({
                          ...value,
                          heatingSetPoint,
                        })
                      }}
                    />
                  )
                }}
              />
            </FormField>
          </div>
        </div>
        <div className='seam-actions'>
          <Button onClick={onCancel}>{t.cancel}</Button>
          <Button variant='solid' onClick={onSave}>
            {t.save}
          </Button>
        </div>
      </div>
    </>
  )
}

const t = {
  climateSetting: 'Climate setting',
  climateSettingSubHeading: 'Choose mode and adjust the climate',
  cancel: 'Cancel',
  save: 'Save',
  next: 'Next',
}
