import classNames from 'classnames'
import { useState } from 'react'
import type { AccessCode } from 'seamapi'

import {
  formatDateTimeReadable,
  get24HoursLater,
  getBrowserTimezone,
  getNow,
  getTimezoneOffset,
} from 'lib/dates.js'
import { EditIcon } from 'lib/icons/Edit.js'
import { useCreateAccessCode } from 'lib/seam/access-codes/use-create-access-code.js'
import { AccessCodeFormDatePicker } from 'lib/seam/components/AccessCodeForm/AccessCodeFormDatePicker.js'
import { TimezonePicker } from 'lib/seam/components/AccessCodeForm/TimezonePicker/TimezonePicker.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { IconButton } from 'lib/ui/IconButton.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { RadioField } from 'lib/ui/RadioField/RadioField.js'
import { TextField } from 'lib/ui/TextField/TextField.js'
import { useToggle } from 'lib/ui/use-toggle.js'

export interface AccessCodeFormProps {
  deviceId: string
  onBack?: () => void
  className?: string
}

export function AccessCodeForm({
  deviceId,
  onBack,
  className,
}: AccessCodeFormProps): JSX.Element | null {
  const { device } = useDevice({
    device_id: deviceId,
  })

  if (device == null) {
    return null
  }

  return (
    <div className={classNames('seam-access-code-form', className)}>
      <Content className={className} onBack={onBack} device={device} />
    </div>
  )
}

function Content({
  onBack,
  device,
}: Omit<AccessCodeFormProps, 'deviceId'> & {
  device: NonNullable<UseDeviceData>
}): JSX.Element {
  const [name, setName] = useState('')
  const [type, setType] = useState<AccessCode['type']>('ongoing')
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [timezone, setTimezone] = useState<string>(getBrowserTimezone())
  const [startDate, setStartDate] = useState<string>(getNow())
  const [endDate, setEndDate] = useState<string>(get24HoursLater())
  const [timezonePickerVisible, toggleTimezonePicker] = useToggle()

  const { save, isLoading } = useSave({
    name,
    type,
    device,
    startDate,
    endDate,
    timezone,
    onSuccess: onBack,
  })

  if (timezonePickerVisible) {
    return (
      <TimezonePicker
        value={timezone}
        onChange={setTimezone}
        onClose={toggleTimezonePicker}
      />
    )
  }

  if (datePickerVisible) {
    return (
      <AccessCodeFormDatePicker
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        timezone={timezone}
        onChangeTimezone={toggleTimezonePicker}
        onBack={() => {
          setDatePickerVisible(false)
        }}
      />
    )
  }

  const nameError = name.length > 60 ? t.overCharacterLimitError : undefined

  const isFormValid =
    name.trim().length > 0 && nameError === undefined && isLoading === false

  return (
    <>
      <ContentHeader
        title={t.addNewAccessCode}
        subheading={device.properties.name}
        onBack={onBack}
      />
      <div className='seam-main'>
        <FormField>
          <InputLabel>{t.nameInputLabel}</InputLabel>
          <TextField
            size='large'
            clearable
            value={name}
            onChange={setName}
            hasError={nameError != null}
            helperText={nameError}
          />
        </FormField>
        <FormField>
          <InputLabel>{t.timingInputLabel}</InputLabel>
          <RadioField
            value={type}
            onChange={setType}
            name='type'
            options={[
              {
                label: t.typeOngoingLabel,
                value: 'ongoing',
              },
              {
                label: t.typeTimeBoundLabel,
                value: 'time_bound',
              },
            ]}
          />
          <>
            {type === 'time_bound' && (
              <div className='seam-selected-times'>
                <div>
                  <span className='seam-label'>{t.startTimeLabel}</span>
                  <span className='seam-time'>
                    {formatDateTimeReadable(startDate)}
                  </span>
                  <span className='seam-label'>{t.endTimeLabel}</span>
                  <span className='seam-time'>
                    {formatDateTimeReadable(endDate)}
                  </span>
                </div>
                <IconButton
                  onClick={() => {
                    setDatePickerVisible(true)
                  }}
                  className='seam-show-date-picker-btn'
                >
                  <EditIcon />
                </IconButton>
              </div>
            )}
          </>
        </FormField>
        <div className='seam-actions'>
          <Button onClick={onBack}>{t.cancel}</Button>
          <Button variant='solid' disabled={!isFormValid} onMouseDown={save}>
            {t.save}
          </Button>
        </div>
      </div>
    </>
  )
}

function useSave(params: {
  name: string
  type: AccessCode['type']
  device: NonNullable<UseDeviceData>
  startDate: string
  endDate: string
  timezone: string
  onSuccess?: () => void
}): any {
  const { name, type, device, startDate, endDate, timezone, onSuccess } = params

  const createAccessCode = useCreateAccessCode()
  const save = (): void => {
    if (name === '') {
      return
    }

    if (createAccessCode.isLoading) {
      return
    }

    if (type === 'time_bound') {
      createAccessCode.mutate(
        {
          name,
          device_id: device.device_id,
          starts_at: createIsoDate(startDate, timezone),
          ends_at: createIsoDate(endDate, timezone),
        },
        {
          onSuccess,
        }
      )

      return
    }

    createAccessCode.mutate(
      {
        name,
        device_id: device.device_id,
      },
      {
        onSuccess,
      }
    )
  }

  return { save, isLoading: createAccessCode.isLoading }
}

function createIsoDate(date: string, timezone: string): string {
  const offset = getTimezoneOffset(timezone)
  return `${date}.000${offset}`
}

const t = {
  addNewAccessCode: 'Add new access code',
  overCharacterLimitError: '60 characters max',
  nameInputLabel: 'Name the new code',
  cancel: 'Cancel',
  save: 'Save',
  timingInputLabel: 'Timing',
  typeOngoingLabel: 'Ongoing',
  typeTimeBoundLabel: 'Start/end times',
  startTimeLabel: 'Start',
  endTimeLabel: 'End',
}
