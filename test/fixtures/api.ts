import { createFake } from '@seamapi/fake-seam-connect'
import { beforeAll } from 'vitest'

import { seedFake } from './seed-fake.js'

declare global {
  // eslint-disable-next-line no-var
  var TEST_SEAM_ENDPOINT: string
  // eslint-disable-next-line no-var
  var TEST_SEAM_PUBLISHABLE_KEY_1: string
  // eslint-disable-next-line no-var
  var TEST_SEAM_PUBLISHABLE_KEY_2: string
  // eslint-disable-next-line no-var
  var TEST_SEAM_CLIENT_SESSION_TOKEN_2: string
}

beforeAll(async () => {
  const fake = await createFake()
  await fake.startServer()
  const endpoint = fake.serverUrl
  const seed = await seedFake(fake.database)

  if (endpoint == null) throw new Error('Fake endpoint is null')
  const res = await fetch(`${endpoint}/health`)
  if (!res.ok) throw new Error('Fake Seam Connect unhealthy')

  globalThis.TEST_SEAM_ENDPOINT = endpoint
  globalThis.TEST_SEAM_PUBLISHABLE_KEY_1 = seed.ws1PublishableKey
  globalThis.TEST_SEAM_PUBLISHABLE_KEY_2 = seed.ws2PublishableKey
  globalThis.TEST_SEAM_CLIENT_SESSION_TOKEN_2 = seed.clientSessionToken2

  return async () => {
    await fake.stopServer()
  }
})
