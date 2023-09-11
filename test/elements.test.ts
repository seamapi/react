import type { ElementDefinition } from 'lib/element.js'
import * as components from 'lib/seam/components/elements.js'

test('unique element names', async () => {
  const elementDefinitions = components as unknown as Record<
    string,
    Partial<ElementDefinition>
  >
  const elementNames = Object.values(elementDefinitions).map(({ name }) => name)
  expect(elementNames).toEqual(Array.from(new Set(elementNames)))
})
