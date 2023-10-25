import type { HvacModeSetting } from 'seamapi'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { ClimateModeMenu } from 'lib/ui/thermostat/ClimateModeMenu.js'
import { TemperatureControlGroup } from 'lib/ui/thermostat/TemperatureControlGroup.js'
import { useState } from 'react'

interface ClimateSettingScheduleFormDefaultClimateSettingProps {
  title: string
  // control: Control<ClimateSettingScheduleFormFields>
  // watch: UseFormWatch<ClimateSettingScheduleFormFields>
  // resetField: UseFormResetField<ClimateSettingScheduleFormFields>
  deviceId: string
  onBack: () => void
  onCancel: (() => void) | undefined
  onSave: () => void
}

export function ClimateSettingScheduleFormDefaultClimateSetting({
  title,
  deviceId,
  onBack,
  onCancel,
  onSave,
}: ClimateSettingScheduleFormDefaultClimateSettingProps): JSX.Element {
  const { device } = useDevice({
    device_id: deviceId,
  })

  const [mode, setMode] = useState<HvacModeSetting>('heat_cool')
  const [heatValue, setHeatValue] = useState(75)
  const [coolValue, setCoolValue] = useState(80)

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
            <ClimateModeMenu mode={mode} onChange={setMode} />

            {mode !== 'off' && (
              <TemperatureControlGroup
                coolValue={coolValue}
                heatValue={heatValue}
                delta={5}
                maxCool={90}
                maxHeat={100}
                minCool={50}
                minHeat={70}
                mode={mode}
                onCoolValueChange={setCoolValue}
                onHeatValueChange={setHeatValue}
              />
            )}
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
