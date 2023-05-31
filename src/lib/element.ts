import r2wc from '@r2wc/react-to-web-component'

export interface ElementDefinition {
  name: string
  Component: Parameters<typeof r2wc>[0]
  props?: ElementProps
}

export type ElementProps = Record<
  string,
  'string' | 'number' | 'boolean' | 'function' | 'json'
>

export const defineCustomElement = ({
  name,
  Component,
  props = {},
}: ElementDefinition): void => {
  const element = r2wc(Component, { props })
  globalThis?.customElements?.define(name, element)
}
