import { createProxyMiddleware } from 'http-proxy-middleware'

import { seedFake } from './seed-fake.js'

// UPSTREAM: This file must use the .js extension.
// https://github.com/storybookjs/storybook/issues/208#issuecomment-1485081586
/** @type {(app: import('express').Router) => void} */
export default async (app) => {
  const { create } = await import('@seamapi/fake-seam-connect')
  const fake = await create()
  seedFake(fake.database.getState())
  await fake.startServer()

  // eslint-disable-next-line no-console
  console.log(`Fake server running at: "${fake.server.serverUrl}"`)

  app.use(
    '/',
    createProxyMiddleware('/api', {
      target: process.env.STORYBOOK_SEAM_ENDPOINT ?? fake.server.serverUrl,
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
