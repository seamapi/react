import {
  createFake as createFakeDevicedb,
  type Fake as FakeDevicedb,
} from '@seamapi/fake-devicedb'
import { createFake, type Fake, type Seed } from '@seamapi/fake-seam-connect'
import { beforeEach } from 'vitest'

export interface ApiTestContext {
  endpoint: string
  seed: Seed
}

beforeEach<ApiTestContext>(async (ctx) => {
  const fake = await getFakeSeamConnect()
  const seed = await fake.seed()
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

const getFakeSeamConnect = async (): Promise<Fake> => {
  const fake = await createFake()

  const fakeDevicedb = await getFakeDevicedb()
  const fakeDevicedbUrl = fakeDevicedb.serverUrl
  if (fakeDevicedbUrl == null) throw new Error('Missing fake devicedb url')
  fake.database.setDevicedbConfig({
    url: fakeDevicedbUrl,
    vercelProtectionBypassSecret:
      fakeDevicedb.database.vercel_protection_bypass_secret,
  })

  await fake.startServer()

  return fake
}

const getFakeDevicedb = async (): Promise<FakeDevicedb> => {
  const fake = await createFakeDevicedb()
  await fake.seed()
  await fake.startServer()

  const endpoint = fake.serverUrl
  if (endpoint == null) throw new Error('Fake devicedb endpoint is null')
  const res = await fetch(`${endpoint}/health`)
  if (!res.ok) throw new Error('Fake Devicedb unhealthy')

  return fake
}
