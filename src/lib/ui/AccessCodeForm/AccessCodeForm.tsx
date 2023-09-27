import classNames from 'classnames'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { type AccessCode, type CommonDevice, isLockDevice } from 'seamapi'

import {
  get24HoursLater,
  getNow,
  getSystemZone,
  getZoneNameFromIsoDate,
} from 'lib/dates.js'
import type { UseAccessCodeData } from 'lib/seam/access-codes/use-access-code.js'
import { useGenerateAccessCodeCode } from 'lib/seam/access-codes/use-generate-access-code-code.js'
import type { UseDeviceData } from 'lib/seam/devices/use-device.js'
import { AccessCodeFormDatePicker } from 'lib/ui/AccessCodeForm/AccessCodeFormDatePicker.js'
import { AccessCodeFormTimes } from 'lib/ui/AccessCodeForm/AccessCodeFormTimes.js'
import { AccessCodeFormTimeZonePicker } from 'lib/ui/AccessCodeForm/AccessCodeFormTimeZonePicker.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { RadioField } from 'lib/ui/RadioField/RadioField.js'
import { TextField } from 'lib/ui/TextField/TextField.js'
import { useToggle } from 'lib/ui/use-toggle.js'

export interface AccessCodeFormSubmitData {
  name: string
  code: string
  type: AccessCode['type']
  device: NonNullable<UseDeviceData>
  startDate: string
  endDate: string
  timezone: string
}

export interface ResponseErrors {
  unknown?: string | undefined
  code?: string | undefined
}

export interface AccessCodeFormProps {
  accessCode?: NonNullable<UseAccessCodeData>
  device: NonNullable<UseDeviceData>
  isSubmitting: boolean
  onSubmit: (data: AccessCodeFormSubmitData) => void
  responseErrors: ResponseErrors | null
  onBack: (() => void) | undefined
  className: string | undefined
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
  responseErrors,
}: Omit<AccessCodeFormProps, 'className'>): JSX.Element {
  const [type, setType] = useState<AccessCode['type']>(
    accessCode?.type ?? 'ongoing'
  )
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [timezone, setTimeZone] = useState<string>(
    getAccessCodeTimeZone(accessCode) ?? getSystemZone()
  )
  const [startDate, setStartDate] = useState<string>(
    getAccessCodeDate('starts_at', accessCode) ?? getNow()
  )
  const [endDate, setEndDate] = useState<string>(
    getAccessCodeDate('ends_at', accessCode) ?? get24HoursLater()
  )

  const save = (data: { name: string; code: string }): void => {
    if (isSubmitting) {
      return
    }

    onSubmit({
      name: data.name,
      code: data.code,
      type,
      device,
      startDate,
      endDate,
      timezone,
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: accessCode?.name ?? '',
      code: accessCode?.code ?? '',
    },
  })
  const [timezonePickerVisible, toggleTimeZonePicker] = useToggle()

  const { isLoading: isGeneratingCode, mutate: generateCode } =
    useGenerateAccessCodeCode()

  const submit = (): void => {}

  if (timezonePickerVisible) {
    return (
      <AccessCodeFormTimeZonePicker
        value={timezone}
        onChange={setTimeZone}
        onClose={toggleTimeZonePicker}
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
        onChangeTimeZone={toggleTimeZonePicker}
        onBack={() => {
          setDatePickerVisible(false)
        }}
      />
    )
  }

  const title = accessCode == null ? t.addNewAccessCode : t.editAccessCode

  const handleGenerateCode = (): void => {
    generateCode(
      {
        device_id: device.device_id,
      },
      {
        onSuccess: ({ code: generatedCode }) => {
          if (generatedCode != null) {
            setValue('code', generatedCode)
          }
        },
      }
    )
  }

  const validateCodeLength = (value: string): boolean | string => {
    if (!isLockDevice(device)) {
      return true
    }

    if (device.properties.supported_code_lengths == null) {
      return true
    }

    if (device.properties.supported_code_lengths.includes(value.length)) {
      return true
    }

    return t.codeLengthError(
      device.properties.supported_code_lengths.join(', ')
    )
  }

  const hasCodeError = errors.code != null || responseErrors?.code != null

  const codeLengthRequirement = getCodeLengthRequirement(device)

  const codeLengthRequirementMessage =
    codeLengthRequirement != null
      ? t.codeLengthRequirement(codeLengthRequirement)
      : null

  return (
    <>
      <ContentHeader
        title={title}
        subheading={device.properties.name}
        onBack={onBack}
      />
      <div className='seam-main'>
        <form
          onSubmit={(event) => {
            void handleSubmit(save)(event)
          }}
        >
          <FormField>
            <InputLabel>{t.nameInputLabel}</InputLabel>
            <TextField
              size='large'
              clearable
              hasError={errors.name != null}
              helperText={errors.name?.message}
              inputProps={{
                ...register('name', {
                  required: t.nameRequiredError,
                  maxLength: {
                    value: 60,
                    message: t.nameOverCharacterLimitError,
                  },
                }),
              }}
            />
          </FormField>
          <FormField className='seam-code-field'>
            <InputLabel>{t.codeInputLabel}</InputLabel>
            <TextField
              size='large'
              clearable
              hasError={hasCodeError}
              helperText={responseErrors?.code ?? errors.code?.message}
              inputProps={{
                ...register('code', {
                  required: t.codeRequiredError,
                  validate: validateCodeLength,
                }),
              }}
            />
            <div
              className={classNames('seam-bottom', {
                'has-hints': codeLengthRequirementMessage != null,
              })}
            >
              {codeLengthRequirementMessage != null && (
                <ul
                  className={classNames('seam-requirements', {
                    'seam-error': hasCodeError,
                  })}
                >
                  <li>{codeLengthRequirementMessage}</li>
                  <li>{t.codeNumbersOnlyRequirement}</li>
                </ul>
              )}
              <Button
                size='small'
                onMouseDown={(e) => {
                  e.preventDefault() // Disable stealing input focus
                  handleGenerateCode()
                }}
                disabled={isGeneratingCode}
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
          {responseErrors?.unknown != null && (
            <div className='seam-unknown-error'>{responseErrors?.unknown}</div>
          )}
          <div className='seam-actions'>
            <Button onClick={onBack}>{t.cancel}</Button>
            <Button
              variant='solid'
              disabled={isSubmitting}
              onMouseDown={submit}
              type='submit'
            >
              {t.save}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

function getAccessCodeTimeZone(
  accessCode?: NonNullable<UseAccessCodeData>
): undefined | string {
  if (accessCode == null) {
    return undefined
  }

  if (accessCode.type === 'ongoing') {
    return undefined
  }

  const date = accessCode.starts_at

  const timezone = getZoneNameFromIsoDate(date)
  if (timezone == null) {
    return undefined
  }

  return timezone
}

function getCodeLengthRequirement(device: CommonDevice): string | null {
  if (!isLockDevice(device)) {
    return null
  }

  const codeLengths = device.properties.supported_code_lengths
  if (codeLengths == null) {
    return null
  }

  if (codeLengths.length === 1) {
    return `${codeLengths[0]}`
  }

  if (isSequential(codeLengths.join(''))) {
    return `${codeLengths[0]}-${codeLengths[codeLengths.length - 1]}`
  }

  return codeLengths.join(', ')
}

// 0 - 99 in a string
// 0123456789101112...99
const sequentialNumbers = Array.from({ length: 100 }, (_, index) => index).join(
  ''
)

function isSequential(numbers: string): boolean {
  return sequentialNumbers.includes(numbers)
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
  nameOverCharacterLimitError: '60 characters max',
  nameRequiredError: 'Name is required',
  nameInputLabel: 'Name the new code',
  codeGenerateButton: 'Generate code',
  codeInputLabel: 'Enter the code (PIN)',
  codeRequiredError: 'Code is required',
  codeLengthError: (lengths: string) =>
    `Code length must be one of the following: ${lengths}`,
  codeLengthRequirement: (lengths: string) => `${lengths} digit code`,
  codeNumbersOnlyRequirement: 'Numbers only',
  cancel: 'Cancel',
  save: 'Save',
  timingInputLabel: 'Timing',
  typeOngoingLabel: 'Ongoing',
  typeTimeBoundLabel: 'Start/end times',
}
