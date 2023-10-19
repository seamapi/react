import { createFake as createFakeDevicedb } from '@seamapi/fake-devicedb'
import { createFake } from '@seamapi/fake-seam-connect'
import { beforeEach } from 'vitest'

import { type Seed, seedFake } from './seed-fake.js'

export interface ApiTestContext {
  endpoint: string
  seed: Seed
}

beforeEach<ApiTestContext>(async (ctx) => {
  const fake = await createFake()
  const seed = await seedFake(fake.database)

  const fakeDevicedb = await createFakeDevicedb()
  await fakeDevicedb.seed()
  await fakeDevicedb.startServer()
  const fakeDevicedbUrl = fakeDevicedb.serverUrl
  if (fakeDevicedbUrl == null) throw new Error('Missing fake devicedb url')
  fake.database.setDevicedbConfig({
    url: fakeDevicedbUrl,
    vercelProtectionBypassSecret:
      fakeDevicedb.database.vercel_protection_bypass_secret,
  })

  await fake.startServer()
  const endpoint = fake.serverUrl

  if (endpoint == null) throw new Error('Fake endpoint is null')
  const res = await fetch(`${endpoint}/health`)
  if (!res.ok) throw new Error('Fake Seam Connect unhealthy')

  ctx.endpoint = endpoint
  ctx.seed = seed

  return async () => {
    await fake.stopServer()
  }
})
