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
  const fakeDevicedb = await getFakeDevicedb()
  const fake = await getFakeSeamConnect(fakeDevicedb)
  const seed = await fake.seed()
  const endpoint = fake.serverUrl

  if (endpoint == null) throw new Error('Fake endpoint is null')
  const res = await fetch(`${endpoint}/health`)
  if (!res.ok) throw new Error('Fake Seam Connect unhealthy')

  ctx.endpoint = endpoint
  ctx.seed = seed

  return () => {
    fake.server?.close()
    fakeDevicedb.server?.close()
  }
})

const getFakeSeamConnect = async (
  fakeDevicedb: FakeDevicedb
): Promise<Fake> => {
  const fake = await createFake()

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
