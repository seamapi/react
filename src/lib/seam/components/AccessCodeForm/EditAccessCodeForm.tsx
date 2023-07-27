import { createIsoDate } from 'lib/dates.js'
import {
  useAccessCode,
  type UseAccessCodeData,
} from 'lib/seam/access-codes/use-access-code.js'
import { useUpdateAccessCode } from 'lib/seam/access-codes/use-update-access-code.js'
import {
  AccessCodeForm,
  type AccessCodeFormSubmitData,
} from 'lib/seam/components/AccessCodeForm/AccessCodeForm.js'
import { useDevice } from 'lib/seam/devices/use-device.js'

export interface EditAccessCodeFormProps {
  onBack?: () => void
  className?: string
  accessCodeId: string
}

export function EditAccessCodeForm({
  accessCodeId,
  onBack,
  className,
}: EditAccessCodeFormProps): JSX.Element | null {
  const { accessCode } = useAccessCode({
    access_code_id: accessCodeId,
  })

  if (accessCode == null) {
    return null
  }

  return (
    <Content accessCode={accessCode} className={className} onBack={onBack} />
  )
}

function Content({
  className,
  onBack,
  accessCode,
}: Omit<EditAccessCodeFormProps, 'accessCodeId'> & {
  accessCode: NonNullable<UseAccessCodeData>
}): JSX.Element | null {
  const { device } = useDevice({
    device_id: accessCode.device_id,
  })

  const { submit, isSubmitting } = useUpdate(accessCode, onBack)

  if (device == null) {
    return null
  }

  return (
    <AccessCodeForm
      onBack={onBack}
      className={className}
      accessCode={accessCode}
      device={device}
      onSubmit={submit}
      isSubmitting={isSubmitting}
    />
  )
}

function useUpdate(
  accessCode: NonNullable<UseAccessCodeData>,
  onSuccess?: () => void
): {
  submit: (data: AccessCodeFormSubmitData) => void
  isSubmitting: boolean
} {
  const { mutate, isLoading: isSubmitting } = useUpdateAccessCode()

  const submit = (data: AccessCodeFormSubmitData): void => {
    const { name, type, device, startDate, endDate, timezone } = data
    if (name === '') {
      return
    }

    if (isSubmitting) {
      return
    }

    if (type === 'time_bound') {
      mutate(
        {
          access_code_id: accessCode.access_code_id,
          name,
          device_id: device.device_id,
          type: 'time_bound',
          starts_at: createIsoDate(startDate, timezone),
          ends_at: createIsoDate(endDate, timezone),
        },
        {
          onSuccess,
        }
      )

      return
    }

    mutate(
      {
        access_code_id: accessCode.access_code_id,
        name,
        type: 'ongoing',
        device_id: device.device_id,
      },
      {
        onSuccess,
      }
    )
  }

  return { submit, isSubmitting }
}
