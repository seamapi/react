import { screen, waitFor } from '@testing-library/react'
import { expect, test } from 'vitest'

import {
  type EcosystemTestContext,
  fakeEmbedKey,
  setupFakeEcosystem,
} from 'fixtures/ecosystem.js'
import { parseBooleanProp } from 'lib/ecosystem-element.js'

setupFakeEcosystem()

test('registers the ecosystem custom elements', async () => {
  const { elementNames } = await import('@seamapi/react/ecosystem')
  expect(elementNames).toEqual([
    'seam-compatible-apps',
    'seam-supported-devices',
  ])
  for (const elementName of elementNames) {
    expect(globalThis.customElements.get(elementName)).toBeDefined()
  }
})

test('elements.js also registers the ecosystem custom elements', async () => {
  await import('@seamapi/react/ecosystem')
  const { elementNames } = await import('@seamapi/react/elements')
  expect(elementNames).toContain('seam-compatible-apps')
  expect(elementNames).toContain('seam-supported-devices')
})

test('parseBooleanProp', () => {
  expect(parseBooleanProp(undefined)).toBeUndefined()
  expect(parseBooleanProp(null)).toBeUndefined()
  expect(parseBooleanProp(true)).toBe(true)
  expect(parseBooleanProp(false)).toBe(false)
  expect(parseBooleanProp('')).toBe(true)
  expect(parseBooleanProp('true')).toBe(true)
  expect(parseBooleanProp('hide-search')).toBe(true)
  expect(parseBooleanProp('false')).toBe(false)
  expect(parseBooleanProp('FALSE')).toBe(false)
  expect(parseBooleanProp('0')).toBe(false)
})

test<EcosystemTestContext>('<seam-compatible-apps> renders from attributes', async (ctx) => {
  await import('@seamapi/react/ecosystem')
  const element = globalThis.document.createElement('seam-compatible-apps')
  element.setAttribute('device-type', 'smartlock')
  element.setAttribute('embed-key', fakeEmbedKey)
  element.setAttribute('ecosystem-endpoint', ctx.ecosystemEndpoint)
  element.setAttribute('disable-css-injection', '')
  element.setAttribute('disable-font-injection', '')
  element.setAttribute('hide-search', '')
  element.setAttribute('max-visible', '2')
  globalThis.document.body.appendChild(element)

  await screen.findByText('StayPilot')
  screen.getByText('Works with these apps')
  expect(screen.queryByRole('searchbox')).toBeNull()
  screen.getByRole('button', { name: 'Show 8 more apps' })
  expect(
    globalThis.document.querySelector(
      'link[href*="react.seam.co"], link[href*="fonts.googleapis.com"]'
    )
  ).toBeNull()

  element.setAttribute('hide-search', 'false')
  await waitFor(() => {
    screen.getByRole('searchbox', { name: 'Search apps' })
  })

  element.remove()
})
