import { createIsoDate } from 'lib/dates.js'
import { useCreateAccessCode } from 'lib/seam/access-codes/use-create-access-code.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'
import {
  AccessCodeForm,
  type AccessCodeFormSubmitData,
} from 'lib/ui/AccessCodeForm/AccessCodeForm.js'

export interface CreateAccessCodeFormProps {
  className?: string
  onBack?: () => void
  deviceId: string
}

export function CreateAccessCodeForm({
  className,
  onBack,
  deviceId,
}: CreateAccessCodeFormProps): JSX.Element | null {
  const { device } = useDevice({
    device_id: deviceId,
  })

  if (device == null) {
    return null
  }

  return <Content device={device} className={className} onBack={onBack} />
}

function Content({
  device,
  className,
  onBack,
}: Omit<CreateAccessCodeFormProps, 'deviceId'> & {
  device: NonNullable<UseDeviceData>
}): JSX.Element {
  const { submit, isSubmitting } = useSubmitCreateAccessCode(onBack)

  return (
    <AccessCodeForm
      device={device}
      className={className}
      onBack={onBack}
      onSubmit={submit}
      isSubmitting={isSubmitting}
    />
  )
}

function useSubmitCreateAccessCode(onSuccess?: () => void): {
  submit: (data: AccessCodeFormSubmitData) => void
  isSubmitting: boolean
} {
  const { mutate, isLoading: isSubmitting } = useCreateAccessCode()
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
          name,
          device_id: device.device_id,
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
        name,
        device_id: device.device_id,
      },
      {
        onSuccess,
      }
    )
  }

  return { submit, isSubmitting }
}
