import { useComponentTelemetry } from 'lib/telemetry/index.js'

import {
  useAccessCode,
  type UseAccessCodeData,
} from 'lib/seam/access-codes/use-access-code.js'
import { useUpdateAccessCode } from 'lib/seam/access-codes/use-update-access-code.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { useResponseErrors } from 'lib/seam/components/CreateAccessCodeForm/CreateAccessCodeForm.js'
import { useDevice } from 'lib/seam/devices/use-device.js'
import {
  AccessCodeForm,
  type AccessCodeFormSubmitData,
  type ResponseErrors,
} from 'lib/ui/AccessCodeForm/AccessCodeForm.js'

export interface EditAccessCodeFormProps extends CommonProps {
  accessCodeId: string
  onSuccess?: (accessCodeId: string) => void
}

export const NestedEditAccessCodeForm =
  withRequiredCommonProps(EditAccessCodeForm)

export function EditAccessCodeForm({
  accessCodeId,
  onBack,
  className,
  onSuccess,
}: EditAccessCodeFormProps): JSX.Element | null {
  useComponentTelemetry('EditAccessCodeForm')

  const { accessCode } = useAccessCode({
    access_code_id: accessCodeId,
  })

  if (accessCode == null) {
    return null
  }

  return (
    <Content
      accessCode={accessCode}
      className={className}
      onBack={onBack}
      onSuccess={onSuccess}
    />
  )
}

function Content({
  className,
  onBack,
  accessCode,
  onSuccess,
}: Omit<EditAccessCodeFormProps, 'accessCodeId'> & {
  accessCode: NonNullable<UseAccessCodeData>
}): JSX.Element | null {
  const { device } = useDevice({
    device_id: accessCode.device_id,
  })

  const { submit, isSubmitting, responseErrors } = useSubmitEditAccessCode(
    accessCode,
    () => {
      if (onSuccess != null) {
        onSuccess(accessCode.access_code_id)
      }

      if (onBack != null) {
        onBack()
      }
    }
  )

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
      responseErrors={responseErrors}
    />
  )
}

function useSubmitEditAccessCode(
  accessCode: NonNullable<UseAccessCodeData>,
  onSuccess?: () => void
): {
  submit: (data: AccessCodeFormSubmitData) => void
  isSubmitting: boolean
  responseErrors: ResponseErrors | null
} {
  const { mutate, isLoading: isSubmitting } = useUpdateAccessCode()
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
          access_code_id: accessCode.access_code_id,
          name,
          code,
          device_id: device.device_id,
          type: 'time_bound',
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
        access_code_id: accessCode.access_code_id,
        name,
        code,
        type: 'ongoing',
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
