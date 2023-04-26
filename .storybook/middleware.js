import { createProxyMiddleware } from 'http-proxy-middleware'

// UPSTREAM: https://github.com/storybookjs/storybook/issues/208#issuecomment-1485081586
/** @type {(app: import('express').Router) => void} */
export default async (app) => {
  const { create } = await import('@seamapi/fake-seam-connect')
  const fake = await create()
  await fake.startServer()
  app.use(
    '/api',
    createProxyMiddleware({
      target: fake.server.serverUrl,
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    })
  )
}
