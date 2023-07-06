import classNames from 'classnames'
import { useState } from 'react'

import { useDevice } from 'lib/seam/devices/use-device.js'
import { Button } from 'lib/ui/Button.js'
import { FormField } from 'lib/ui/FormField.js'
import { InputLabel } from 'lib/ui/InputLabel.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

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

  const [code, setCode] = useState('')

  if (device == null) {
    return null
  }

  console.log(code)

  return (
    <div className={classNames('seam-access-code-form', className)}>
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

        <FormField className='seam-code-field'>
          <InputLabel>Enter the code (PIN)</InputLabel>
          <TextField size='large' clearable onChange={setCode} />
          <div className='seam-bottom '>
            <ul className='seam-requirements'>
              <li>4-8 digit code</li>
              <li>Numbers only</li>
            </ul>
            <Button size='small'>Generate code</Button>
          </div>
        </FormField>
      </div>
    </div>
  )
}

const t = {
  addNewAccessCode: 'Add new access code',
}
