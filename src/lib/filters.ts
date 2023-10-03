import type { SeamWarning } from 'seamapi'

import type { AnyError } from 'lib/index.js'

export const accessCodeErrorFilter = (error: AnyError): boolean => {
  if ('is_access_code_error' in error && error.is_access_code_error) return true
  return false
}

export const accessCodeWarningFilter = (warning: SeamWarning): boolean => {
  const relevantWarnings = [
    'delay_in_removing_from_device',
    'delay_in_setting_on_device',
    'code_modified_external_to_seam',
  ]

  return relevantWarnings.includes(warning.warning_code)
}

export const deviceErrorFilter = (error: AnyError): boolean => {
  if ('is_device_error' in error && error.is_device_error) return true
  return false
}

export const deviceWarningFilter = (warning: SeamWarning): boolean => {
  const relevantWarnings = [
    'device_has_flaky_connection',
    'third_party_integration_detected',
    'salto_office_mode',
    'salto_privacy_mode',
    'ttlock_lock_gateway_unlocking_not_enabled',
  ]

  return relevantWarnings.includes(warning.warning_code)
}
