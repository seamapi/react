import { expect, test } from 'vitest'

import {
  getEmbedConfig,
  getEmbeddedViewport,
  getParentOrigin,
} from './config.js'

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

test('embedded viewport dimensions accept finite bounds and reject malformed messages', () => {
  const type = 'seam-supported-devices:viewport'
  expect(getEmbeddedViewport({ type, top: 120, height: 640 })).toEqual({
    top: 120,
    height: 640,
  })
  for (const data of [
    null,
    { type, top: -1, height: 640 },
    { type, top: 0, height: 0 },
    { type, top: 0, height: Infinity },
    { type, top: NaN, height: 640 },
    { type, top: '0', height: 640 },
    { type: 'other', top: 0, height: 640 },
  ])
    expect(getEmbeddedViewport(data)).toBeNull()
})
