import type { AccessCode } from 'seamapi'

import { createIsoDate } from 'lib/dates.js'
import { useCreateAccessCode } from 'lib/seam/access-codes/use-create-access-code.js'
import type { AccessCodeFormProps } from 'lib/seam/components/AccessCodeForm/AccessCodeForm.js'
import AccessCodeFormContent from 'lib/seam/components/AccessCodeForm/AccessCodeFormContent.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'

export function AccessCodeAddForm({
  deviceId,
  onBack,
  className,
}: Omit<AccessCodeFormProps, 'deviceId'> & {
  deviceId: string
}): JSX.Element | null {
  const { device } = useDevice({
    device_id: deviceId,
  })

  const { submit, isLoading } = useSubmit()

  if (device == null) {
    return null
  }

  return (
    <AccessCodeFormContent
      device={device}
      className={className}
      onBack={onBack}
      onSubmit={submit}
      isLoading={isLoading}
    />
  )
}

export interface AccessCodeAddFormSubmitParams {
  name: string
  type: AccessCode['type']
  device: NonNullable<UseDeviceData>
  startDate: string
  endDate: string
  timezone: string
  onSuccess?: () => void
}

function useSubmit(): {
  submit: (params: AccessCodeAddFormSubmitParams) => void
  isLoading: boolean
} {
  const { mutate, isLoading } = useCreateAccessCode()
  const submit = (params: AccessCodeAddFormSubmitParams): void => {
    const { name, type, device, startDate, endDate, timezone, onSuccess } =
      params
    if (name === '') {
      return
    }

    if (isLoading) {
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

  return { submit, isLoading }
}
