import { useState } from 'react'
import type { SeamError } from 'seamapi'

import { useComponentTelemetry } from 'lib/telemetry/index.js'

import { createIsoDate } from 'lib/dates.js'
import { useCreateAccessCode } from 'lib/seam/access-codes/use-create-access-code.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { useDevice, type UseDeviceData } from 'lib/seam/devices/use-device.js'
import { getValidationError } from 'lib/seam/error-handlers.js'
import {
  AccessCodeForm,
  type AccessCodeFormSubmitData,
  type ResponseErrors,
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
  const { submit, isSubmitting, codeError, responseErrors } =
    useSubmitCreateAccessCode({
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
      responseErrors={responseErrors}
    />
  )
}

function useSubmitCreateAccessCode(params: { onSuccess: () => void }): {
  codeError: string | null
  submit: (data: AccessCodeFormSubmitData) => void
  isSubmitting: boolean
  responseErrors: ResponseErrors | null
} {
  const { onSuccess } = params
  const { mutate, isLoading: isSubmitting } = useCreateAccessCode()
  const [codeError, setCodeError] = useState<string | null>(null)
  const { responseErrors, handleResponseError, resetResponseErrors } =
    useResponseErrors()

  const handleError = (error: SeamError): void => {
    handleResponseError(error)
    const codeError = getValidationError({ error, property: 'code' })
    if (codeError != null) {
      setCodeError(codeError)
    }
  }

  const submit = (data: AccessCodeFormSubmitData): void => {
    resetResponseErrors()
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

  return { submit, isSubmitting, codeError, responseErrors }
}

export function useResponseErrors(): {
  responseErrors: ResponseErrors | null
  handleResponseError: (error: SeamError) => void
  resetResponseErrors: () => void
} {
  const [responseErrors, setResponseErrors] = useState<Record<
    string,
    string | undefined
  > | null>(null)

  const handleResponseError = (error: SeamError): void => {
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
