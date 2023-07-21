import classNames from 'classnames'
import { useState } from 'react'
import type { AccessCode } from 'seamapi'

import {
  createIsoDate,
  get24HoursLater,
  getBrowserTimezone,
  getNow,
} from 'lib/dates.js'
import { useCreateAccessCode } from 'lib/seam/access-codes/use-create-access-code.js'
import { AccessCodeFormDatePicker } from 'lib/seam/components/AccessCodeForm/AccessCodeFormDatePicker.js'
import { AccessCodeFormTimes } from 'lib/seam/components/AccessCodeForm/AccessCodeFormTimes.js'
import { AccessCodeFormTimezonePicker } from 'lib/seam/components/AccessCodeForm/AccessCodeFormTimezonePicker.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
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

  const { submit, isLoading } = useSubmit({
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
      <AccessCodeFormTimezonePicker
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
    name.trim().length > 0 && nameError === undefined && !isLoading

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
              <AccessCodeFormTimes
                startDate={startDate}
                endDate={endDate}
                onEdit={() => {
                  setDatePickerVisible(true)
                }}
              />
            )}
          </>
        </FormField>
        <div className='seam-actions'>
          <Button onClick={onBack}>{t.cancel}</Button>
          <Button variant='solid' disabled={!isFormValid} onMouseDown={submit}>
            {t.save}
          </Button>
        </div>
      </div>
    </>
  )
}

function useSubmit(params: {
  name: string
  type: AccessCode['type']
  device: NonNullable<UseDeviceData>
  startDate: string
  endDate: string
  timezone: string
  onSuccess?: () => void
}): {
  submit: () => void
  isLoading: boolean
} {
  const { name, type, device, startDate, endDate, timezone, onSuccess } = params

  const { mutate, isLoading } = useCreateAccessCode()
  const submit = (): void => {
    if (name === '') {
      return
    }

    if (isLoading) {
      return
    }

    if (type === 'time_bound') {
      mutate(
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

    mutate(
      {
        name,
        device_id: device.device_id,
      },
      {
        onSuccess,
      }
    )
  }

  return { submit, isLoading }
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
}
