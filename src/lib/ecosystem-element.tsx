import r2wc from '@rxfork/r2wc-react-to-web-component'
import type { ComponentType } from 'react'

import {
  EcosystemProvider,
  type EcosystemProviderProps,
} from 'lib/seam/ecosystem/EcosystemProvider.js'

declare global {
  // eslint-disable-next-line no-var
  var disableSeamCssInjection: boolean | undefined
  // eslint-disable-next-line no-var
  var disableSeamFontInjection: boolean | undefined
  // eslint-disable-next-line no-var
  var unminifiySeamCss: boolean | undefined
}

type PropType = 'string' | 'number' | 'boolean' | 'array' | 'object'

export type EcosystemElementProps<T> = Record<
  Exclude<keyof T, 'className'>,
  PropType
>

export interface EcosystemElementDefinition {
  name: string
  Component: ComponentType<any>
  props?: Record<string, PropType>
}

type ProviderProps = Omit<
  EcosystemProviderProps,
  'children' | 'dehydratedState'
>

const providerProps: Record<keyof ProviderProps, PropType> = {
  embedKey: 'string',
  ecosystemEndpoint: 'string',
  queryClient: 'object',
  disableCssInjection: 'boolean',
  disableFontInjection: 'boolean',
  unminifiyCss: 'boolean',
}

const commonProps: Record<string, PropType> = {
  className: 'string',
}

/**
 * Defines the custom elements for the Seam Ecosystem components.
 * Each element is wrapped in an `<EcosystemProvider />`, not a `<SeamProvider />`,
 * so it needs no publishable key and does not load the Seam API client.
 * Elements that are already defined are skipped,
 * so `elements.js` and `ecosystem.js` may both be loaded on one page.
 */
export const defineEcosystemElements = (
  definitions: Record<string, Partial<EcosystemElementDefinition>>
): string[] => {
  const names: string[] = []
  for (const [key, definition] of Object.entries(definitions)) {
    const { name, Component, props } = definition
    if (name == null) throw new Error(`Missing element name for ${key}`)
    if (Component == null) {
      throw new Error(`Missing element Component for ${key}`)
    }
    names.push(name)
    defineEcosystemElement({ name, Component, props })
  }
  return names
}

export const defineEcosystemElement = ({
  name,
  Component,
  props = {},
}: EcosystemElementDefinition): void => {
  const registry = globalThis.customElements
  if (registry == null || registry.get(name) != null) return

  const allProps = { ...props, ...providerProps, ...commonProps }

  // UPSTREAM: r2wc parses boolean attributes as false when present without a value,
  // e.g., <seam-compatible-apps hide-search>, so they are parsed here instead.
  const booleanProps = Object.entries(allProps)
    .filter(([, type]) => type === 'boolean')
    .map(([prop]) => prop)

  const element = r2wc(withEcosystemProvider(Component, booleanProps), {
    props: Object.fromEntries(
      Object.entries(allProps).map(([prop, type]) => [
        prop,
        type === 'boolean' ? 'string' : type,
      ])
    ),
  })

  registry.define(name, element)
}

/**
 * Parses a boolean attribute or property:
 * present without a value or `true` is true; absent or `false` is false.
 */
export const parseBooleanProp = (value: unknown): boolean | undefined => {
  if (value == null) return undefined
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return Boolean(value)
  return !/^(false|0|no|off)$/i.test(value.trim())
}

function withEcosystemProvider(
  Component: ComponentType<any>,
  booleanProps: string[]
): (props: Record<string, unknown>) => JSX.Element {
  const name = Component.displayName ?? Component.name ?? 'Component'

  function WithEcosystemProvider({
    container: _container,
    ...rawProps
  }: Record<string, unknown>): JSX.Element {
    const props: Record<string, unknown> = { ...rawProps }
    for (const prop of booleanProps) {
      props[prop] = parseBooleanProp(props[prop])
    }

    const {
      embedKey,
      ecosystemEndpoint,
      queryClient,
      disableCssInjection,
      disableFontInjection,
      unminifiyCss,
      ...componentProps
    } = props as ProviderProps & Record<string, unknown>

    return (
      <EcosystemProvider
        embedKey={embedKey}
        ecosystemEndpoint={ecosystemEndpoint}
        queryClient={queryClient}
        disableCssInjection={
          disableCssInjection ?? globalThis.disableSeamCssInjection
        }
        disableFontInjection={
          disableFontInjection ?? globalThis.disableSeamFontInjection
        }
        unminifiyCss={unminifiyCss ?? globalThis.unminifiySeamCss}
      >
        <Component {...componentProps} />
      </EcosystemProvider>
    )
  }

  WithEcosystemProvider.displayName = `WithEcosystemProvider(${name})`

  return WithEcosystemProvider
}
