import classNames from 'classnames'

import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { TextField } from 'lib/ui/TextField/TextField.js'

export interface AccessCodeAddFormProps {
  className?: string
  onBack?: () => void
}

export function AccessCodeAddForm({
  className,
  onBack,
}: AccessCodeAddFormProps) {
  return (
    <div className={classNames('seam-access-code-add-form', className)}>
      <ContentHeader title='Add new access code' onBack={onBack} />
      <TextField />
    </div>
  )
}
