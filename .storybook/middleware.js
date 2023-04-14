import { createProxyMiddleware } from 'http-proxy-middleware'

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
