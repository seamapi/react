import classNames from 'classnames'
import { useState } from 'react'
import type { AccessCode } from 'seamapi'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { RadioField } from 'lib/ui/RadioField/RadioField.js'
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

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [type, setType] = useState<AccessCode['type']>('ongoing')
  const [codeInputFocused, toggleCodeInputFocused] = useToggle()

  if (device == null) {
    return null
  }

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

  return (
    <div className={classNames('seam-access-code-form', className)}>
      <ContentHeader
        title={t.addNewAccessCode}
        subheading={device.properties.name}
        onBack={onBack}
      />
      <div className='content'>
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
            <Button size='small'>{t.codeGenerateButton}</Button>
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
    </div>
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
}
