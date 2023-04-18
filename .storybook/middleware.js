import { createProxyMiddleware } from 'http-proxy-middleware'

/** @type {(app: import('express').Router) => void} */
export default (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://connect.getseam.com',
      pathRewrite: { '^/api': '' },
      changeOrigin: true
    })
  )
}
