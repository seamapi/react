import { defineCustomElement, type ElementDefinition } from 'lib/element.js'
import * as components from 'lib/seam/components/elements.js'

const elementDefinitions = components as unknown as Record<
  string,
  Partial<ElementDefinition>
>

export const elementNames: string[] = []

export default elementNames

for (const key of Object.keys(elementDefinitions)) {
  const elementDefinition = elementDefinitions[key]

  if (elementDefinition == null) {
    throw new Error(`Missing element definition for ${key}`)
  }

  const { name, Component, props } = elementDefinition

  if (name == null) {
    throw new Error(`Missing element name for ${key}`)
  }

  if (Component == null) {
    throw new Error(`Missing element Component for ${key}`)
  }

  elementNames.push(name)
  defineCustomElement({ name, Component, props })
}
