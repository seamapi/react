import {
  Controller,
  type Control,
  type UseFormResetField,
  type UseFormWatch,
} from 'react-hook-form'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import type { ClimateSettingScheduleFormFields } from 'lib/ui/ClimateSettingForm/ClimateSettingScheduleForm.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { ClimateModeMenu } from 'lib/ui/thermostat/ClimateModeMenu.js'
import { TemperatureControlGroup } from 'lib/ui/thermostat/TemperatureControlGroup.js'
import type { HvacModeSetting } from 'seamapi'

interface ClimateSettingScheduleFormClimateSettingProps {
  title: string
  control: Control<ClimateSettingScheduleFormFields>
  watch: UseFormWatch<ClimateSettingScheduleFormFields>
  resetField: UseFormResetField<ClimateSettingScheduleFormFields>
  deviceId: string
  onBack: () => void
  onCancel: (() => void) | undefined
  onSave: () => void
}

export function ClimateSettingScheduleFormClimateSetting({
  title,
  control,
  watch,
  resetField,
  deviceId,
  onBack,
  onCancel,
  onSave,
}: ClimateSettingScheduleFormClimateSettingProps): JSX.Element {
  const { device } = useDevice({
    device_id: deviceId,
  })

  const hvacModeSetting = watch('hvacModeSetting')

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
            <FormContent
              control={control}
              resetField={resetField}
              hvacModeSetting={hvacModeSetting}
            />
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

interface FormContentProps {
  control: Control<ClimateSettingScheduleFormFields>
  resetField: UseFormResetField<ClimateSettingScheduleFormFields>
  hvacModeSetting: HvacModeSetting
}

const FormContent: React.FC<FormContentProps> = ({
  control,
  resetField,
  hvacModeSetting,
}) => {
  return (
    <>
      <FormField>
        <Controller
          name='hvacModeSetting'
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <ClimateModeMenu
                mode={value}
                onChange={(mode) => {
                  resetField('setPoints')
                  onChange(mode)
                }}
              />
            )
          }}
        />
      </FormField>
      {hvacModeSetting !== 'off' && (
        <FormField className='seam-climate-setting-slider-container'>
          <Controller
            name='setPoints'
            control={control}
            render={({ field: { value, onChange } }) => (
              <TemperatureControlGroup
                coolValue={value.coolingSetPoint}
                heatValue={value.heatingSetPoint}
                delta={5}
                maxCool={90}
                maxHeat={100}
                minCool={50}
                minHeat={70}
                mode={hvacModeSetting}
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
            )}
          />
        </FormField>
      )}
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
