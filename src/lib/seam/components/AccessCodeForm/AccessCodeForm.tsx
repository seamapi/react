import { AccessCodeAddForm } from 'lib/seam/components/AccessCodeForm/AccessCodeAddForm.js'
import { AccessCodeEditForm } from 'lib/seam/components/AccessCodeForm/AccessCodeEditForm.js'

export interface AccessCodeFormProps {
  onBack?: () => void
  className?: string
  deviceId?: string
  accessCodeId?: string
}

export function AccessCodeForm({
  deviceId,
  onBack,
  className,
  accessCodeId,
}: AccessCodeFormProps): JSX.Element | null {
  if (accessCodeId != null) {
    return (
      <AccessCodeEditForm
        accessCodeId={accessCodeId}
        onBack={onBack}
        className={className}
      />
    )
  }

  if (deviceId != null) {
    return (
      <AccessCodeAddForm
        deviceId={deviceId}
        onBack={onBack}
        className={className}
      />
    )
  }

  throw new Error(
    '<AccessCodeForm/> requires either an accessCodeId, or deviceId.'
  )
}
