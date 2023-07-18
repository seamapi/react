import classNames from 'classnames'
import { useEffect, useState } from 'react'
import type { AccessCode } from 'seamapi'

import {
  getBrowserTimezone,
  getTimezoneLabel,
  getTimezoneOffset,
} from 'lib/dates.js'
import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { useCreateAccessCode } from 'lib/seam/access-codes/use-create-access-code.js'
import { TimezonePicker } from 'lib/seam/components/AccessCodeForm/TimezonePicker/TimezonePicker.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { DateTimePicker } from 'lib/ui/DateTimePicker/DateTimePicker.js'
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
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [timezonePickerVisible, toggleTimezonePicker] = useToggle()

  const createAccessCode = useCreateAccessCode()

  // Auto-show date picker screen if we've selected a time_bound Access
  // Code, but don't have dates
  useEffect(() => {
    if (type !== 'time_bound') {
      return
    }

    if (startDate != null || endDate != null) {
      return
    }

    setDatePickerVisible(true)
  }, [type, startDate, endDate, setDatePickerVisible])

  const save = (): void => {
    if (name === '') {
      return
    }

    if (createAccessCode.isLoading) {
      return
    }

    const offset = getTimezoneOffset(timezone)
    const startsAtFull =
      startDate != null ? `${startDate}.000${offset}` : undefined
    const endsAtFull = endDate != null ? `${endDate}.000${offset}` : undefined

    createAccessCode.mutate(
      {
        name,
        device_id: device.device_id,
        starts_at: startsAtFull,
        ends_at: endsAtFull,
      },
      {
        onSuccess: () => {
          onBack?.()
        },
      }
    )
  }

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
      <div className='seam-schedule-picker'>
        <ContentHeader
          title={t.timingTitle}
          onBack={() => {
            setDatePickerVisible(false)
          }}
        />
        <div className='seam-content'>
          <div className='seam-timezone'>
            <span className='seam-label'>{t.selectedTimezoneLabel}</span>
            <span className='seam-selected' onClick={toggleTimezonePicker}>
              {getTimezoneLabel(timezone)}
              <ChevronRightIcon />
            </span>
          </div>
          <FormField>
            <InputLabel>{t.startTimeLabel}</InputLabel>
            <DateTimePicker
              value={startDate == null ? '' : startDate}
              onChange={setStartDate}
              size='large'
            />
          </FormField>
          <FormField>
            <InputLabel>{t.endTimeLabel}</InputLabel>
            <DateTimePicker
              value={endDate == null ? '' : endDate}
              onChange={setEndDate}
              size='large'
            />
          </FormField>
        </div>
      </div>
    )
  }

  const nameError = name.length > 60 ? t.overCharacterLimitError : undefined

  const isFormValid =
    name.trim().length > 0 &&
    nameError === undefined &&
    !createAccessCode.isLoading

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

const t = {
  addNewAccessCode: 'Add new access code',
  overCharacterLimitError: '60 characters max',
  nameInputLabel: 'Name the new code',
  cancel: 'Cancel',
  save: 'Save',
  timingInputLabel: 'Timing',
  typeOngoingLabel: 'Ongoing',
  typeTimeBoundLabel: 'Start/end times',
  timingTitle: 'Timing',
  selectedTimezoneLabel: 'All times in',
  startTimeLabel: 'Start',
  endTimeLabel: 'End',
}
