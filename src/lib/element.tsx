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
  disableDeleteAccessCode: 'boolean',
  onBack: 'object',
  className: 'string',
}

const providerProps: R2wcProps<ProviderProps> = {
  publishableKey: 'string',
  userIdentifierKey: 'string',
  clientSessionToken: 'string',
  endpoint: 'string',
  queryClient: 'object',
  disableCssInjection: 'boolean',
  disableFontInjection: 'boolean',
  unminifiyCss: 'boolean',
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
) {
  return function ({
    publishableKey,
    endpoint,
    userIdentifierKey,
    clientSessionToken,
    disableCssInjection,
    disableFontInjection,
    unminifiyCss,
    container: _container,
    ...props
  }: ProviderProps & { container: Container } & P): JSX.Element | null {
    return (
      <SeamProvider
        publishableKey={publishableKey}
        userIdentifierKey={userIdentifierKey}
        clientSessionToken={clientSessionToken}
        endpoint={endpoint}
        disableCssInjection={
          disableCssInjection ?? globalThis.disableSeamCssInjection
        }
        disableFontInjection={
          disableFontInjection ?? globalThis.disableSeamFontInjection
        }
        unminifiyCss={unminifiyCss ?? globalThis.unminifiySeamCss}
      >
        <Component {...(props as P)} />
      </SeamProvider>
    )
  }
}
