import r2wc from '@r2wc/react-to-web-component'
import type { QueryClient } from '@tanstack/react-query'
import type { ComponentType } from 'react'
import type { Container } from 'react-dom'

import {
  SeamProvider,
  type SeamProviderPropsWithClientSessionToken,
  type SeamProviderPropsWithPublishableKey,
} from 'lib/seam/SeamProvider.js'

export interface ElementDefinition {
  name: string
  Component: Parameters<typeof r2wc>[0]
  props?: ElementProps<Record<string, object>>
}

export type ElementProps<T> = Partial<
  Record<keyof T, 'string' | 'number' | 'boolean' | 'function' | 'json'>
>

type ProviderProps = SeamProviderPropsWithPublishableKey &
  SeamProviderPropsWithClientSessionToken

const providerProps: ElementProps<ProviderProps> = {
  publishableKey: 'string',
  userIdentifierKey: 'string',
  clientSessionToken: 'string',
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
    },
  })
  globalThis?.customElements?.define(name, element)
}

function withProvider<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>
) {
  return ({
    publishableKey,
    userIdentifierKey,
    clientSessionToken,
    disableCssInjection,
    disableFontInjection,
    unminifiyCss,
    container: _container,
    ...props
  }: ProviderProps & { container: Container } & P): JSX.Element | null => {
    return (
      <SeamProvider
        publishableKey={publishableKey}
        userIdentifierKey={userIdentifierKey}
        clientSessionToken={clientSessionToken}
        disableCssInjection={disableCssInjection}
        disableFontInjection={disableFontInjection}
        unminifiyCss={unminifiyCss}
      >
        <Component {...(props as P)} />
      </SeamProvider>
    )
  }
}
