import { useState } from 'react'

import { useDevice } from 'lib/seam/devices/use-device.js'
import type { HvacModeSetting } from 'lib/seam/thermostats/thermostat-device.js'
import { Button } from 'lib/ui/Button.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { ClimateSettingControlGroup } from 'lib/ui/thermostat/ClimateSettingControlGroup.js'

interface ClimateSettingScheduleFormDefaultClimateSettingProps {
  title: string
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
  const [heatValue, setHeatValue] = useState(70)
  const [coolValue, setCoolValue] = useState(75)

  return (
    <>
      <ContentHeader
        title={title}
        onBack={onBack}
        subheading={device?.properties.name}
      />
      <div className='seam-main'>
        <div className='seam-climate-setting-schedule-form-default-climate-setting'>
          <div className='seam-content'>
            <div className='seam-default-climate-setting-message'>
              <p>{t.defaultClimateMessage}</p>
            </div>
            <div className='seam-control-group-title'>
              <InputLabel>{t.defaultClimate}</InputLabel>
              <span className='seam-label'>{t.defautClimateSubHeading}</span>
            </div>
            <ClimateSettingControlGroup
              mode={mode}
              onModeChange={setMode}
              heatValue={heatValue}
              onHeatValueChange={setHeatValue}
              coolValue={coolValue}
              onCoolValueChange={setCoolValue}
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

const t = {
  defaultClimate: 'Default Climate',
  defautClimateSubHeading:
    'Choose the default mode and climate for this device',
  defaultClimateMessage:
    'This device doesn’t have a default climate set up yet. Choose the climate you’d like the device to fall back to after scheduled climates reach their ends.',
  cancel: 'Cancel',
  save: 'Save',
}
