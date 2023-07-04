import classNames from 'classnames'

import { useDevice } from 'lib/seam/devices/use-device.js'
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

  if (device == null) {
    return null
  }

  return (
    <div className={classNames('seam-access-code-add-form', className)}>
      <ContentHeader
        title={t.addNewAccessCode}
        subheading={device.properties.name}
        onBack={onBack}
      />
      <div className='content'>
        <InputLabel>Name the new code</InputLabel>
        <TextField size='large' clearable />
      </div>
    </div>
  )
}

const t = {
  addNewAccessCode: 'Add new access code',
}
