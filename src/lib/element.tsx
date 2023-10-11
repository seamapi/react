import r2wc from '@rxfork/r2wc-react-to-web-component'
import type { ComponentType } from 'react'
import type { Container } from 'react-dom'

import type { CommonProps } from 'lib/seam/components/common-props.js'
import {
  SeamProvider,
  type SeamProviderPropsWithClientSessionToken,
  type SeamProviderPropsWithPublishableKey,
} from 'lib/seam/SeamProvider.js'

declare global {
  // eslint-disable-next-line no-var
  var disableSeamTelemetry: boolean | undefined
  // eslint-disable-next-line no-var
  var disableSeamCssInjection: boolean | undefined
  // eslint-disable-next-line no-var
  var disableSeamFontInjection: boolean | undefined
  // eslint-disable-next-line no-var
  var unminifiySeamCss: boolean | undefined
}

export interface ElementDefinition {
  name: string
  Component: Parameters<typeof r2wc>[0]
  props?: R2wcProps<Record<string, object>>
}

export type ElementProps<T> = R2wcProps<Omit<T, keyof CommonProps>>

type R2wcProps<T> = Record<
  keyof T,
  'string' | 'number' | 'boolean' | 'array' | 'function' | 'json' | 'object'
>

type ProviderProps = Omit<
  SeamProviderPropsWithPublishableKey & SeamProviderPropsWithClientSessionToken,
  'children'
>

const commonProps: R2wcProps<CommonProps> = {
  disableLockUnlock: 'boolean',
  disableCreateAccessCode: 'boolean',
  disableEditAccessCode: 'boolean',
  disableDeleteAccessCode: 'boolean',
  disableResourceIds: 'boolean',
  onBack: 'object',
  className: 'string',
}

const providerProps: R2wcProps<ProviderProps> = {
  publishableKey: 'string',
  userIdentifierKey: 'string',
  clientSessionToken: 'string',
  endpoint: 'string',
  queryClient: 'object',
  telemetryClient: 'object',
  disableTelemetry: 'boolean',
  disableCssInjection: 'boolean',
  disableFontInjection: 'boolean',
  unminifiyCss: 'boolean',
  onSessionUpdate: 'object',
}

export const defineCustomElement = ({
  name,
  Component,
  props = {},
}: ElementDefinition): void => {
  const element = r2wc(withProvider(Component), {
    props: {
      ...props,
      ...providerProps,
      ...commonProps,
    },
  })
  globalThis.customElements?.define(name, element)
}

function withProvider<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>
): (props: ProviderProps & { container: Container } & P) => JSX.Element | null {
  const name = Component.displayName ?? Component.name ?? 'Component'

  function WithProvider({
    publishableKey,
    endpoint,
    userIdentifierKey,
    clientSessionToken,
    disableTelemetry,
    disableCssInjection,
    disableFontInjection,
    unminifiyCss,
    onSessionUpdate,
    container: _container,
    ...props
  }: ProviderProps & { container: Container } & P): JSX.Element | null {
    return (
      <SeamProvider
        publishableKey={publishableKey}
        userIdentifierKey={userIdentifierKey}
        clientSessionToken={clientSessionToken}
        endpoint={endpoint}
        disableTelemetry={disableTelemetry ?? globalThis.disableSeamTelemetry}
        disableCssInjection={
          disableCssInjection ?? globalThis.disableSeamCssInjection
        }
        disableFontInjection={
          disableFontInjection ?? globalThis.disableSeamFontInjection
        }
        unminifiyCss={unminifiyCss ?? globalThis.unminifiySeamCss}
        onSessionUpdate={onSessionUpdate}
      >
        <Component {...(props as P)} />
      </SeamProvider>
    )
  }

  WithProvider.displayName = `WithProvider(${name})`

  return WithProvider
}
