import type { SeamError, SeamWarning } from 'seamapi'

export const errorCodeToMessageMapping: Record<
  SeamError['error_code'],
  string
> = {
  account_disconnected: 'Device account has been disconnected.',
  device_removed: 'Device has been removed from its connected account.',
  hub_disconnected: 'Device hub has been disconnected.',
}

export const warningCodeToMessageMapping: Record<
  SeamWarning['warning_code'],
  string
> = {
  salto_office_mode:
    'Salto office mode is enabled. Access codes will not unlock doors. You can disable office mode in the Salto dashboard.',
  salto_privacy_mode:
    'Salto privacy mode is enabled. Access codes will not unlock doors. You can disable privacy mode by pressing the back of the lock.',
}
