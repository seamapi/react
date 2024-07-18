import type {
  AccessCodeError,
  AccessCodeWarning,
  ConnectedAccountError,
  DeviceError,
  DeviceWarning,
} from '@seamapi/types/connect'

type SeamResourceError = ConnectedAccountError | DeviceError | AccessCodeError

export const accessCodeErrorFilter = (error: SeamResourceError): boolean => {
  return 'is_access_code_error' in error && error.is_access_code_error
}

export const accessCodeWarningFilter = (_: AccessCodeWarning): boolean => {
  return true
}

export const deviceErrorFilter = (error: SeamResourceError): boolean => {
  return 'is_device_error' in error && error.is_device_error
}

export const deviceWarningFilter = (_: DeviceWarning): boolean => {
  return true
}

export const connectedAccountErrorFilter = (
  error: SeamResourceError
): boolean => {
  return (
    'is_connected_account_error' in error && error.is_connected_account_error
  )
}
