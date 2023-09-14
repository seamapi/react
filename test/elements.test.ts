import { expect, test } from 'vitest'

test('registers all custom elements', async () => {
  const { elementNames } = await import('@seamapi/react/elements')
  for (const elementName of elementNames) {
    const element = globalThis.customElements.get(elementName)
    expect(element).toBeDefined()
  }
})
