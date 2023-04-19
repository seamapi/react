import { createProxyMiddleware } from 'http-proxy-middleware'

// UPSTREAM: https://github.com/storybookjs/storybook/issues/208#issuecomment-1485081586

/** @type {(app: import('express').Router) => void} */
export default (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://connect.getseam.com',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    })
  )
}
