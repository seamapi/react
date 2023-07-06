import classNames from 'classnames'
import { useState } from 'react'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TextField } from 'lib/ui/TextField/TextField.js'
import { useToggle } from 'lib/ui/use-toggle.js'

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
            error={nameError()}
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
          />
          <div
            className={classNames('seam-bottom', {
              'seam-visible': codeInputFocused,
            })}
          >
            <ul className='seam-requirements'>
              <li>{t.codeRequirementLength}</li>
              <li>{t.codeRequirementNumbersOnly}</li>
            </ul>
            <Button size='small'>{t.codeGenerateButton}</Button>
          </div>
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
}
