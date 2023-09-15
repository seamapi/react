import { useState } from 'react'
import type { SeamError } from 'seamapi'

import { createIsoDate } from 'lib/dates.js'
import { useCreateAccessCode } from 'lib/seam/access-codes/use-create-access-code.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'
import { getValidationError } from 'lib/seam/error-handlers.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'
import {
  AccessCodeForm,
  type AccessCodeFormSubmitData,
} from 'lib/ui/AccessCodeForm/AccessCodeForm.js'

export interface CreateAccessCodeFormProps extends CommonProps {
  deviceId: string
}

export const NestedCreateAccessCodeForm =
  withRequiredCommonProps(CreateAccessCodeForm)

export function CreateAccessCodeForm({
  className,
  onBack,
  deviceId,
}: CreateAccessCodeFormProps): JSX.Element | null {
  useComponentTelemetry('CreateAccessCodeForm')

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
  const { submit, isSubmitting, codeError } = useSubmitCreateAccessCode({
    onSuccess: () => {
      if (onBack != null) {
        onBack()
      }
    },
  })

  return (
    <AccessCodeForm
      device={device}
      className={className}
      onBack={onBack}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      codeError={codeError}
    />
  )
}

function useSubmitCreateAccessCode(params: { onSuccess: () => void }): {
  codeError: string | null
  submit: (data: AccessCodeFormSubmitData) => void
  isSubmitting: boolean
} {
  const { onSuccess } = params
  const { mutate, isLoading: isSubmitting } = useCreateAccessCode()
  const [codeError, setCodeError] = useState<string | null>(null)

  const handleError = (error: SeamError): void => {
    const codeError = getValidationError({ error, property: 'code' })
    if (codeError != null) {
      setCodeError(codeError)
    }
  }

  const submit = (data: AccessCodeFormSubmitData): void => {
    setCodeError(null)

    const { name, code, type, device, startDate, endDate, timezone } = data
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
          code,
          device_id: device.device_id,
          starts_at: createIsoDate(startDate, timezone),
          ends_at: createIsoDate(endDate, timezone),
        },
        {
          onSuccess,
          onError: handleError,
        }
      )

      return
    }

    mutate(
      {
        name,
        code,
        device_id: device.device_id,
      },
      {
        onSuccess,
        onError: handleError,
      }
    )
  }

  return { submit, isSubmitting, codeError }
}
