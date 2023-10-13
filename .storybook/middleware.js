import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { createProxyMiddleware } from 'http-proxy-middleware'

import { seedFake } from './seed-fake.js'

// UPSTREAM: This file must use the .js extension.
// https://github.com/storybookjs/storybook/issues/208#issuecomment-1485081586
/** @type {(app: import('express').Router) => void} */
export default async (app) => {
  const { createFake } = await import('@seamapi/fake-seam-connect')
  const fake = await createFake()
  seedFake(fake.database)

  const fakeDevicedb = await getFakeDevicedb()
  const fakeDevicedbUrl = fakeDevicedb.serverUrl
  if (fakeDevicedbUrl == null) throw new Error('Missing fake devicedb url')
  fake.database.setDevicedbConfig({
    url: fakeDevicedbUrl,
    vercelProtectionBypassSecret:
      fakeDevicedb.database.vercel_protection_bypass_secret,
  })

  await fake.startServer()

  // eslint-disable-next-line no-console
  console.log(`Fake server running at: "${fake.serverUrl}"`)

  app.use(
    '/',
    createProxyMiddleware('/api', {
      target: process.env.STORYBOOK_SEAM_ENDPOINT ?? fake.serverUrl,
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    })
  )

  app.use(
    '/',
    createProxyMiddleware('/examples', {
      target: 'http://localhost:8080',
    })
  )
}

const getFakeDevicedb = async () => {
  const { createFake } = await import('@seamapi/fake-devicedb')
  const seed = await readFile(
    fileURLToPath(new URL('devicedb-seed.json', import.meta.url))
  )
  const fake = await createFake()
  await fake.loadJSON(JSON.parse(seed.toString()))
  await fake.startServer()

  // eslint-disable-next-line no-console
  console.log(`Fake Devicedb server running at: "${fake.serverUrl}"`)

  return fake
}
