import type { SeamHttpApiError } from '@seamapi/http/connect'
import type { AccessCode } from '@seamapi/types/connect'
import { useState } from 'react'

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
  type ResponseErrors,
} from 'lib/ui/AccessCodeForm/AccessCodeForm.js'

export interface CreateAccessCodeFormProps extends CommonProps {
  deviceId: string
  onSuccess?: (accessCodeId: string) => void
}

export const NestedCreateAccessCodeForm =
  withRequiredCommonProps(CreateAccessCodeForm)

export function CreateAccessCodeForm({
  className,
  onBack,
  deviceId,
  onSuccess,
}: CreateAccessCodeFormProps): JSX.Element | null {
  useComponentTelemetry('CreateAccessCodeForm')

  const { device } = useDevice({
    device_id: deviceId,
  })

  if (device == null) {
    return null
  }

  return (
    <Content
      device={device}
      className={className}
      onBack={onBack}
      onSuccess={onSuccess}
    />
  )
}

function Content({
  device,
  className,
  onBack,
  onSuccess,
}: Omit<CreateAccessCodeFormProps, 'deviceId'> & {
  device: NonNullable<UseDeviceData>
}): JSX.Element {
  const { submit, isSubmitting, responseErrors } = useSubmitCreateAccessCode({
    onSuccess: (accessCode: AccessCode) => {
      if (onSuccess != null) {
        onSuccess(accessCode.access_code_id)
      }

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
      responseErrors={responseErrors}
    />
  )
}

function useSubmitCreateAccessCode(params: {
  onSuccess: (accessCode: AccessCode) => void
}): {
  submit: (data: AccessCodeFormSubmitData) => void
  isSubmitting: boolean
  responseErrors: ResponseErrors | null
} {
  const { onSuccess } = params
  const { mutate, isPending: isSubmitting } = useCreateAccessCode()
  const { responseErrors, handleResponseError, resetResponseErrors } =
    useResponseErrors()

  const submit = (data: AccessCodeFormSubmitData): void => {
    resetResponseErrors()

    const { name, code, type, device, startDate, endDate } = data
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
          starts_at: startDate,
          ends_at: endDate,
        },
        {
          onSuccess,
          onError: handleResponseError,
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
        onError: handleResponseError,
      }
    )
  }

  return { submit, isSubmitting, responseErrors }
}

export function useResponseErrors(): {
  responseErrors: ResponseErrors | null
  handleResponseError: (error: SeamHttpApiError) => void
  resetResponseErrors: () => void
} {
  const [responseErrors, setResponseErrors] = useState<Record<
    string,
    string | undefined
  > | null>(null)

  const handleResponseError = (error: SeamHttpApiError): void => {
    const code = getValidationError({ error, property: 'code' })
    const name = getValidationError({ error, property: 'name' })

    if (code != null || name != null) {
      setResponseErrors({
        code,
        name,
      })

      return
    }

    setResponseErrors({
      unknown: t.genericResponseError,
    })
  }

  const resetResponseErrors = (): void => {
    setResponseErrors(null)
  }

  return {
    responseErrors,
    handleResponseError,
    resetResponseErrors,
  }
}

const t = {
  genericResponseError: 'The code could not be saved. Please try again.',
}
