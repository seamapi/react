import classNames from 'classnames'
import { useState } from 'react'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

export interface AccessCodeAddFormProps {
  className?: string
  onBack?: () => void
  deviceId: string
}

export function AccessCodeAddForm({
  className,
  onBack,
  deviceId,
}: AccessCodeAddFormProps) {
  const { device } = useDevice({
    device_id: deviceId,
  })

  const [code, setCode] = useState('')

  if (device == null) {
    return null
  }

  console.log(code)

  return (
    <div className={classNames('seam-access-code-add-form', className)}>
      <ContentHeader
        title={t.addNewAccessCode}
        subheading={device.properties.name}
        onBack={onBack}
      />
      <div className='content'>
        <FormField>
          <InputLabel>Name the new code</InputLabel>
          <TextField size='large' clearable />
        </FormField>

        <FormField>
          <InputLabel>Enter the code (PIN)</InputLabel>
          <TextField size='large' clearable onChange={setCode} />
          <div>
            <ul>
              <li>4-8 digit code</li>
              <li>Numbers only</li>
            </ul>
            <Button>Generate code</Button>
          </div>
        </FormField>
      </div>
    </div>
  )
}

const t = {
  addNewAccessCode: 'Add new access code',
}
