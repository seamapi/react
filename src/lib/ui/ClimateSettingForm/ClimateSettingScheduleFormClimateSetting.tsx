import { type Control,Controller } from 'react-hook-form'
import { isThermostatDevice } from 'seamapi'

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

  if (device == null) return <></>
  if (!isThermostatDevice(device)) return <></>
  const properties = device.properties

  let setPointBounds = {}

  if (properties.is_cooling_available) {
    setPointBounds = {
      minCool: properties.min_cooling_set_point_fahrenheit,
      maxCool: properties.max_cooling_set_point_fahrenheit,
    }
  }

  if (properties.is_heating_available) {
    setPointBounds = {
      ...setPointBounds,
      minHeat: properties.min_heating_set_point_fahrenheit,
      maxHeat: properties.max_heating_set_point_fahrenheit,
    }
  }

  if (properties.is_cooling_available && properties.is_heating_available) {
    setPointBounds = {
      ...setPointBounds,
      delta: properties.min_heating_cooling_delta_fahrenheit,
    }
  }

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
            <FormContent control={control} />
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
}

function FormContent({ control }: FormContentProps): JSX.Element {
  return (
    <FormField>
      <Controller
        name='climateSetting'
        control={control}
        render={({ field: { value, onChange } }) => (
          <ClimateSettingControlGroup
            mode={value.hvacModeSetting}
            onModeChange={(mode) => {
              onChange({ ...value, hvacModeSetting: mode })
            }}
            coolValue={value.coolingSetPoint}
            heatValue={value.heatingSetPoint}
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
  )
}

const t = {
  climateSetting: 'Climate setting',
  climateSettingSubHeading: 'Choose mode and adjust the climate',
  cancel: 'Cancel',
  save: 'Save',
  next: 'Next',
}
