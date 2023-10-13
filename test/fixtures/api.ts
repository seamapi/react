import { createFake } from '@seamapi/fake-seam-connect'
import { beforeEach } from 'vitest'

import { type Seed, seedFake } from './seed-fake.js'

export interface ApiTestContext {
  endpoint: string
  seed: Seed
}

beforeEach<ApiTestContext>(async (ctx) => {
  const fake = await createFake()
  await fake.startServer()
  const endpoint = fake.serverUrl
  const seed = await seedFake(fake.database)

  if (endpoint == null) throw new Error('Fake endpoint is null')
  const res = await fetch(`${endpoint}/health`)
  if (!res.ok) throw new Error('Fake Seam Connect unhealthy')

  ctx.endpoint = endpoint
  ctx.seed = seed

  return async () => {
    await fake.stopServer()
  }
})
