import classNames from 'classnames'
import { useEffect, useState } from 'react'
import type { AccessCode } from 'seamapi'

import { getBrowserTimezone, getTimezoneLabel } from 'lib/dates.js'
import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { getRandomInt } from 'lib/numbers.js'
import { TimezonePicker } from 'lib/seam/components/AccessCodeForm/TimezonePicker/TimezonePicker.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { RadioField } from 'lib/ui/RadioField/RadioField.js'
import { DateTextField } from 'lib/ui/TextField/DateTextField.js'
import { TextField } from 'lib/ui/TextField/TextField.js'
import { TimeTextField } from 'lib/ui/TextField/TimeTextField.js'
import { useToggle } from 'lib/ui/use-toggle.js'

const minCodeLength = 4
const maxCodeLength = 8

export interface AccessCodeFormProps {
  className?: string
  onBack?: () => void
  deviceId: string
}

export function AccessCodeForm({
  className,
  onBack,
  deviceId,
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
  const [code, setCode] = useState('')
  const [type, setType] = useState<AccessCode['type']>('ongoing')
  const [codeInputFocused, toggleCodeInputFocused] = useToggle()
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [timezone, setTimezone] = useState<string>(getBrowserTimezone())
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<string | null>(null)
  const [endTime, setEndTime] = useState<string | null>(null)
  const [timezonePickerVisible, toggleTimezonePicker] = useToggle()

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

  const nameError = (): string | undefined => {
    if (name.length > 60) {
      return t.overCharacterLimitError
    }
    return undefined
  }

  const codeError = (): string | undefined => {
    // Only check code on any input
    if (code.trim().length === 0) {
      return undefined
    }

    // If a non-digit exists
    if (/\D/.test(code)) {
      return 'Number only.'
    }

    if (code.length < minCodeLength || code.length > maxCodeLength) {
      return 'Code must be between 4, and 8 digits.'
    }

    return undefined
  }

  const generateCode = (): void => {
    // Randomize code length
    const length = getRandomInt({ min: minCodeLength, max: maxCodeLength })
    // Fill each digit with a random int from 0-9
    const generated = Array.from({ length }, () =>
      getRandomInt({ min: 0, max: 9 })
    ).join('')

    setCode(generated)
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
            <DateTextField
              value={startDate != null ? startDate : undefined}
              onChange={setStartDate}
              size='large'
            />
            <TimeTextField
              value={startTime != null ? startTime : ''}
              onChange={setStartTime}
              size='large'
            />
          </FormField>
        </div>
      </div>
    )
  }

  console.log('start time: ', startTime)

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
            hasError={nameError() != null}
            helperText={nameError()}
          />
        </FormField>

        <FormField className='seam-code-field'>
          <InputLabel>{t.codeInputLabel}</InputLabel>
          <TextField
            size='large'
            clearable
            value={code}
            onChange={setCode}
            onFocus={toggleCodeInputFocused}
            onBlur={toggleCodeInputFocused}
            hasError={codeError() != null}
          />
          <div
            className={classNames('seam-bottom', {
              'seam-visible': codeInputFocused,
            })}
          >
            <ul
              className={classNames('seam-requirements', {
                'seam-error': codeError() != null,
              })}
            >
              <li>{t.codeRequirementLength}</li>
              <li>{t.codeRequirementNumbersOnly}</li>
            </ul>
            <Button
              size='small'
              onMouseDown={(e) => {
                e.preventDefault() // Disable stealing input focus
                generateCode()
              }}
            >
              {t.codeGenerateButton}
            </Button>
          </div>
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
      </div>
    </>
  )
}

const t = {
  addNewAccessCode: 'Add new access code',
  overCharacterLimitError: '60 characters max',
  nameInputLabel: 'Name the new code',
  codeInputLabel: 'Enter the code (PIN)',
  codeRequirementLength: '4-8 digit code',
  codeRequirementNumbersOnly: 'Numbers only',
  codeGenerateButton: 'Generate code',
  timingInputLabel: 'Timing',
  typeOngoingLabel: 'Ongoing',
  typeTimeBoundLabel: 'Start/end times',
  timingTitle: 'Timing',
  selectedTimezoneLabel: 'All times in',
  timezonePickerTitleAuto: 'Time Zone (automatic)',
  timezonePickerTitleManual: 'Time Zone (manual)',
  setTimezoneManuallyLabel: 'Set time zone manually',
  startTimeLabel: 'Start',
  endTimeLabel: 'End',
}
