import classNames from 'classnames'
import { useState } from 'react'

import { getRandomInt } from 'lib/numbers.js'
import { useCreateAccessCode } from 'lib/seam/access-codes/use-create-access-code.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TextField } from 'lib/ui/TextField/TextField.js'
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
  const [codeInputFocused, toggleCodeInputFocused] = useToggle()

  const createAccessCode = useCreateAccessCode(device)

  const save = (): void => {
    if (name === '' || code === '') {
      return
    }

    if (createAccessCode.isLoading) {
      return
    }

    createAccessCode.mutate(
      {
        name,
        code,
      },
      {
        onSuccess: () => {
          onBack?.()
        },
      }
    )
  }

  const nameError = name.length > 0 ? t.overCharacterLimitError : undefined
  const codeError = getCodeError(code)

  const generateCode = (): void => {
    // Randomize code length
    const length = getRandomInt({ min: minCodeLength, max: maxCodeLength })
    // Fill each digit with a random int from 0-9
    const generated = Array.from({ length }, () =>
      getRandomInt({ min: 0, max: 9 })
    ).join('')

    setCode(generated)
  }

  const canSave = (): boolean => {
    return (
      name.trim().length > 0 &&
      nameError === undefined &&
      code.trim().length > 0 &&
      codeError === undefined &&
      !createAccessCode.isLoading
    )
  }

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

        <FormField className='seam-code-field'>
          <InputLabel>{t.codeInputLabel}</InputLabel>
          <TextField
            size='large'
            clearable
            value={code}
            onChange={setCode}
            onFocus={toggleCodeInputFocused}
            onBlur={toggleCodeInputFocused}
            hasError={codeError != null}
          />
          <div
            className={classNames('seam-bottom', {
              'seam-visible': codeInputFocused,
            })}
          >
            <ul
              className={classNames('seam-requirements', {
                'seam-error': codeError != null,
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
        <div className='seam-actions'>
          <Button onClick={onBack}>Cancel</Button>
          <Button variant='solid' disabled={!canSave()} onClick={save}>
            Save
          </Button>
        </div>
      </div>
    </>
  )
}

function getCodeError(code: string): string | undefined {
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

const t = {
  addNewAccessCode: 'Add new access code',
  overCharacterLimitError: '60 characters max',
  nameInputLabel: 'Name the new code',
  codeInputLabel: 'Enter the code (PIN)',
  codeRequirementLength: '4-8 digit code',
  codeRequirementNumbersOnly: 'Numbers only',
  codeGenerateButton: 'Generate code',
}
