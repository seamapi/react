import type { SeamWarning } from 'seamapi'

import type { SeamCompositeError } from 'lib/index.js'

export const accessCodeErrorFilter = (error: SeamCompositeError): boolean => {
  return 'is_access_code_error' in error && error.is_access_code_error
}

export const accessCodeWarningFilter = (_: SeamWarning): boolean => {
  return true
}

export const deviceErrorFilter = (error: SeamCompositeError): boolean => {
  return 'is_device_error' in error && error.is_device_error
}

export const deviceWarningFilter = (_: SeamWarning): boolean => {
  return true
}
