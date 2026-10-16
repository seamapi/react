import { expect, test } from 'vitest'

import type { EmbedResolution } from './types.js'
import { getEmbedKeyManufacturer } from './use-embed-key-resolution.js'

const resolution = (
  embedKey: Partial<EmbedResolution['embed_key']>,
  extra: Partial<EmbedResolution> = {}
): EmbedResolution => ({
  embed_key: {
    embed_key_id: 'key',
    display_name: 'Key',
    owner_kind: 'seam',
    partner_id: null,
    manufacturer_slug: null,
    allowed_origins: [],
    config: {},
    revoked_at: null,
    created_at: '2026-10-01T00:00:00.000Z',
    ...embedKey,
  },
  exclusions: {
    excluded_manufacturers: [],
    excluded_device_types: [],
    unsupported_providers: [],
    capability: '',
    capability_exclusions: [],
  },
  ...extra,
})

test('getEmbedKeyManufacturer: none without a resolution', () => {
  expect(getEmbedKeyManufacturer(null)).toBeNull()
  expect(getEmbedKeyManufacturer(undefined)).toBeNull()
})

test('getEmbedKeyManufacturer: none for seam and partner keys', () => {
  expect(getEmbedKeyManufacturer(resolution({}))).toBeNull()
  expect(
    getEmbedKeyManufacturer(
      resolution({ owner_kind: 'partner', manufacturer_slug: 'schlage' })
    )
  ).toBeNull()
})

test('getEmbedKeyManufacturer: the manufacturer of a manufacturer key', () => {
  expect(
    getEmbedKeyManufacturer(
      resolution({ owner_kind: 'manufacturer', manufacturer_slug: 'schlage' })
    )
  ).toBe('schlage')
})

test('getEmbedKeyManufacturer: prefers the manufacturer context', () => {
  expect(
    getEmbedKeyManufacturer(
      resolution(
        { owner_kind: 'manufacturer', manufacturer_slug: 'schlage' },
        { manufacturer_context: { manufacturer_slug: 'yale' } }
      )
    )
  ).toBe('yale')
  expect(
    getEmbedKeyManufacturer(
      resolution(
        { owner_kind: 'manufacturer', manufacturer_slug: 'schlage' },
        { manufacturer_context: null }
      )
    )
  ).toBe('schlage')
})
