import classNames from 'classnames'
import { useState } from 'react'
import type { AccessCode } from 'seamapi'

import {
  get24HoursLater,
  getBrowserTimezone,
  getNow,
  getTimezoneFromIsoDate,
} from 'lib/dates.js'
import type { UseAccessCodeData } from 'lib/seam/access-codes/use-access-code.js'
import type { UseDeviceData } from 'lib/seam/devices/use-device.js'
import { AccessCodeFormDatePicker } from 'lib/ui/AccessCodeForm/AccessCodeFormDatePicker.js'
import { AccessCodeFormTimes } from 'lib/ui/AccessCodeForm/AccessCodeFormTimes.js'
import { AccessCodeFormTimezonePicker } from 'lib/ui/AccessCodeForm/AccessCodeFormTimezonePicker.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { RadioField } from 'lib/ui/RadioField/RadioField.js'
import { TextField } from 'lib/ui/TextField/TextField.js'
import { useToggle } from 'lib/ui/use-toggle.js'

export interface AccessCodeFormSubmitData {
  name: string
  type: AccessCode['type']
  device: NonNullable<UseDeviceData>
  startDate: string
  endDate: string
  timezone: string
}

export interface AccessCodeFormProps {
  className?: string
  onBack?: () => void
  accessCode?: NonNullable<UseAccessCodeData>
  device: NonNullable<UseDeviceData>
  isSubmitting: boolean
  onSubmit: (data: AccessCodeFormSubmitData) => void
}

export function AccessCodeForm({
  className,
  ...props
}: AccessCodeFormProps): JSX.Element | null {
  return (
    <div className={classNames('seam-access-code-form', className)}>
      <Content {...props} />
    </div>
  )
}

function Content({
  onBack,
  accessCode,
  device,
  onSubmit,
  isSubmitting,
}: Omit<AccessCodeFormProps, 'className'>): JSX.Element {
  const [name, setName] = useState(accessCode?.name ?? '')
  const [type, setType] = useState<AccessCode['type']>(
    accessCode?.type ?? 'ongoing'
  )
  const [datePickerVisible, setDatePickerVisible] = useState(true)
  const [timezone, setTimezone] = useState<string>(
    getAccessCodeTimezone(accessCode) ?? getBrowserTimezone()
  )
  const [startDate, setStartDate] = useState<string>(
    getAccessCodeDate('starts_at', accessCode) ?? getNow()
  )
  const [endDate, setEndDate] = useState<string>(
    getAccessCodeDate('ends_at', accessCode) ?? get24HoursLater()
  )
  const [timezonePickerVisible, toggleTimezonePicker] = useToggle()

  const submit = (): void => {
    if (isSubmitting) {
      return
    }

    onSubmit({
      name,
      type,
      device,
      startDate,
      endDate,
      timezone,
    })
  }

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
    name.trim().length > 0 && nameError === undefined && !isSubmitting

  const title = accessCode == null ? t.addNewAccessCode : t.editAccessCode

  return (
    <>
      <ContentHeader
        title={title}
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

function getAccessCodeTimezone(
  accessCode?: NonNullable<UseAccessCodeData>
): undefined | string {
  if (accessCode == null) {
    return undefined
  }

  if (accessCode.type === 'ongoing') {
    return undefined
  }

  const date = accessCode.starts_at

  const timezone = getTimezoneFromIsoDate(date)
  if (timezone == null) {
    return undefined
  }

  return timezone
}

function getAccessCodeDate(
  date: 'starts_at' | 'ends_at',
  accessCode?: NonNullable<UseAccessCodeData>
): string | undefined {
  if (accessCode == null) {
    return undefined
  }

  if (accessCode.type !== 'time_bound') {
    return undefined
  }

  return accessCode[date]
}

const t = {
  addNewAccessCode: 'Add new access code',
  editAccessCode: 'Edit access code',
  overCharacterLimitError: '60 characters max',
  nameInputLabel: 'Name the new code',
  cancel: 'Cancel',
  save: 'Save',
  timingInputLabel: 'Timing',
  typeOngoingLabel: 'Ongoing',
  typeTimeBoundLabel: 'Start/end times',
}
