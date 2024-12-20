import type {
  AccessCodeError,
  AccessCodeWarning,
  ConnectedAccountError,
  ConnectedAccountWarning,
  DeviceError,
  DeviceWarning,
} from '@seamapi/types/connect'
import type { ComponentType } from 'react'

export interface RequiredCommonProps {
  className: string | undefined
  onBack: (() => void) | undefined
  errorFilter: (
    error: ConnectedAccountError | DeviceError | AccessCodeError
  ) => boolean
  warningFilter: (
    warning: ConnectedAccountWarning | DeviceWarning | AccessCodeWarning
  ) => boolean
  disableDeleteAccessCode: boolean | undefined
  disableCreateAccessCode: boolean | undefined
  disableEditAccessCode: boolean | undefined
  disableLockUnlock: boolean | undefined
  disableResourceIds: boolean | undefined
  disableConnectedAccountInformation: boolean | undefined
}

export type CommonProps = Partial<RequiredCommonProps>

export function withRequiredCommonProps<
  P extends CommonProps & JSX.IntrinsicAttributes,
>(
  Component: ComponentType<P>
): (props: P & RequiredCommonProps) => JSX.Element | null {
  const name = Component.displayName ?? Component.name ?? 'Component'

  function WithRequiredCommonProps(
    props: P & RequiredCommonProps
  ): JSX.Element | null {
    return <Component {...props} />
  }

  WithRequiredCommonProps.displayName = `WithRequiredCommonProps(${name})`

  return WithRequiredCommonProps
}
