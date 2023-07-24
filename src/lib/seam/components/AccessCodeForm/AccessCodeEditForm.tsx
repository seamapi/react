import type { AccessCode } from 'seamapi'

import { createIsoDate } from 'lib/dates.js'
import {
  useAccessCode,
  type UseAccessCodeData,
} from 'lib/seam/access-codes/use-access-code.js'
import { useUpdateAccessCode } from 'lib/seam/access-codes/use-update-access-code.js'
import type { AccessCodeFormProps } from 'lib/seam/components/AccessCodeForm/AccessCodeForm.js'
import AccessCodeFormContent from 'lib/seam/components/AccessCodeForm/AccessCodeFormContent.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'

export function AccessCodeEditForm({
  accessCodeId,
  onBack,
  className,
}: Omit<AccessCodeFormProps, 'accessCodeId'> & {
  accessCodeId: string
}): JSX.Element | null {
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

export interface AccessCodeEditFormSubmitParams {
  name: string
  type: AccessCode['type']
  device: NonNullable<UseDeviceData>
  startDate: string
  endDate: string
  timezone: string
  onSuccess?: () => void
  accessCode: NonNullable<UseAccessCodeData>
}

function Content({
  className,
  onBack,
  accessCode,
}: Omit<AccessCodeFormProps, 'accessCodeId'> & {
  accessCode: NonNullable<UseAccessCodeData>
}): JSX.Element | null {
  const { device } = useDevice({
    device_id: accessCode.device_id,
  })

  if (device == null) {
    return null
  }

  return (
    <AccessCodeFormContent
      onBack={onBack}
      className={className}
      accessCode={accessCode}
      device={device}
    />
  )
}

export function useSubmitUpdate(): {
  submit: (params: AccessCodeEditFormSubmitParams) => void
  isLoading: boolean
} {
  const { mutate, isLoading } = useUpdateAccessCode()
  const submit = (params: AccessCodeEditFormSubmitParams): void => {
    const {
      name,
      type,
      device,
      startDate,
      endDate,
      timezone,
      onSuccess,
      accessCode,
    } = params
    if (name === '') {
      return
    }

    if (isLoading) {
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

  return { submit, isLoading }
}
