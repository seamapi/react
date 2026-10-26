import { expect, test } from 'vitest'

import { getEmbedConfig, getParentOrigin } from './config.js'

test('embed config scopes a provider without inventing a manufacturer', () => {
  expect(
    getEmbedConfig('?provider=first-alert&device_type=thermostat&theme=dark')
  ).toEqual({
    manufacturer: undefined,
    provider: 'first-alert',
    deviceType: 'thermostat',
    capability: undefined,
    theme: 'dark',
    hideTitle: true,
  })
  expect(getEmbedConfig('?manufacturer=august&theme=invalid').theme).toBe(
    'auto'
  )
})

test('parent messages use the exact HTTP origin of the referrer', () => {
  expect(getParentOrigin('https://www.seam.co/docs/august')).toBe(
    'https://www.seam.co'
  )
  expect(getParentOrigin('')).toBeNull()
  expect(getParentOrigin('javascript:alert(1)')).toBeNull()
})
