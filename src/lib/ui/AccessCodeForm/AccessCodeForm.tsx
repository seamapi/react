import type { AccessCode, Device } from '@seamapi/types/connect'
import classNames from 'classnames'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getSystemTimeZone } from 'lib/dates.js'
import { useGenerateAccessCodeCode } from 'lib/seam/access-codes/use-generate-access-code-code.js'
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
  device: Device
  startDate: string
  endDate: string
  timeZone: string
}

export interface ResponseErrors {
  unknown?: string | undefined
  code?: string | undefined
}

export interface AccessCodeFormProps {
  accessCode?: AccessCode
  device: Device
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
  const [timeZone, setTimeZone] = useState<string>(getSystemTimeZone())

  const [startDate, setStartDate] = useState<DateTime>(
    getAccessCodeDate('starts_at', accessCode) ?? getNow(timeZone)
  )
  const [endDate, setEndDate] = useState<DateTime>(
    getAccessCodeDate('ends_at', accessCode) ?? getOneDayFromNow(timeZone)
  )

  const save = (data: { name: string; code: string }): void => {
    if (isSubmitting) {
      return
    }

    const start = startDate.toISO()
    if (start === null || start === undefined) {
      throw new Error(`Invalid start date: ${startDate.invalidReason}`)
    }

    const end = endDate.toISO()
    if (end === null || end === undefined) {
      throw new Error(`Invalid end date: ${endDate.invalidReason}`)
    }

    onSubmit({
      name: data.name,
      code: data.code,
      type,
      device,
      startDate: start,
      endDate: end,
      timeZone,
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
  const [timeZonePickerVisible, toggleTimeZonePicker] = useToggle()

  const { isPending: isGeneratingCode, mutate: generateCode } =
    useGenerateAccessCodeCode()

  const submit = (): void => {}

  if (timeZonePickerVisible) {
    return (
      <AccessCodeFormTimeZonePicker
        value={timeZone}
        onChange={(timeZone: string) => {
          setTimeZone(timeZone)
          setStartDate(startDate.setZone(timeZone))
          setEndDate(endDate.setZone(timeZone))
        }}
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
        timeZone={timeZone}
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
        onSuccess: (generatedCode) => {
          setValue('code', generatedCode)
        },
      }
    )
  }

  const hasCodeError = errors.code != null || responseErrors?.code != null

  const codeLengthRequirement = getCodeLengthRequirement(device)

  const codeLengthRequirementMessage =
    codeLengthRequirement != null
      ? t.codeLengthRequirement(codeLengthRequirement)
      : null

  const hasCodeInputs =
    accessCode?.type !== 'time_bound' && accessCode?.is_offline_access_code

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
          {hasCodeInputs && (
            <>
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
                      validate: (value: string) =>
                        validateCodeLength(device, value),
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
            </>
          )}
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

const validateCodeLength = (
  device: Device,
  value: string
): boolean | string => {
  if (device.properties.supported_code_lengths == null) {
    return true
  }

  if (device.properties.supported_code_lengths.includes(value.length)) {
    return true
  }

  return t.codeLengthError(device.properties.supported_code_lengths.join(', '))
}

const getCodeLengthRequirement = (device: Device): string | null => {
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

const isSequential = (numbers: string): boolean =>
  sequentialNumbers.includes(numbers)

const getAccessCodeDate = (
  key: 'starts_at' | 'ends_at',
  accessCode?: AccessCode
): DateTime | null => {
  if (accessCode == null) {
    return null
  }

  if (accessCode.type !== 'time_bound') {
    return null
  }

  const date = accessCode[key]

  if (date == null) {
    return null
  }

  return DateTime.fromISO(date)
}

const getNow = (timeZone: string): DateTime => DateTime.now().setZone(timeZone)

const getOneDayFromNow = (timeZone: string): DateTime =>
  DateTime.now().setZone(timeZone).plus({ days: 1 })

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
