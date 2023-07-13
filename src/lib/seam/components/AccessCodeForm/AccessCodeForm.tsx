import classNames from 'classnames'
import { useState } from 'react'

import { useCreateAccessCode } from 'lib/seam/access-codes/use-create-access-code.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

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

  const createAccessCode = useCreateAccessCode()

  const save = (): void => {
    if (name === '') {
      return
    }

    if (createAccessCode.isLoading) {
      return
    }

    createAccessCode.mutate(
      {
        name,
        device_id: device.device_id,
      },
      {
        onSuccess: () => {
          onBack?.()
        },
      }
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
}
