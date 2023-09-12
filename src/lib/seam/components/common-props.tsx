import type { ComponentType } from 'react'

export interface RequiredCommonProps {
  className: string | undefined
  onBack: (() => void) | undefined
  disableDeleteAccessCode: boolean | undefined
  disableCreateAccessCode: boolean | undefined
  disableEditAccessCode: boolean | undefined
  disableLockUnlock: boolean | undefined
}

export type CommonProps = Partial<RequiredCommonProps>

export function withRequiredCommonProps<
  P extends CommonProps & JSX.IntrinsicAttributes,
>(Component: ComponentType<P>) {
  return function (props: P & RequiredCommonProps): JSX.Element | null {
    return <Component {...props} />
  }
}
