import { env } from 'node:process'
import { setTimeout } from 'node:timers/promises'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

/** @type {(url: string) => import('vite').ResolvedConfig} */
export default defineConfig(async ({ command }) => {
  const target = 'https://connect.getseam.com'
  const endpoint = command === 'build' ? target : '/api'
  await setupEnv(endpoint)
  return {
    envPrefix: 'SEAM_',
    plugins: [tsconfigPaths(), react()],
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target,
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true,
        },
      },
    },
  }
})

/** @type {(endpoint: string) => Promise<void>} */
const setupEnv = async (endpoint) => {
  env.SEAM_ENDPOINT ??= endpoint

  if (env.SEAM_PUBLISHABLE_KEY == null) {
    // eslint-disable-next-line no-console
    console.warn(
      `> Using the default publishable key.
> Use your own by setting SEAM_PUBLISHABLE_KEY in your environment.
> Get one for free at https://console.seam.co/
`
    )
    await setTimeout(2000)
    env.SEAM_PUBLISHABLE_KEY = 'seam_pk1fGd41X_zKs0ZELRWEc8nWxiBsrTFC98'
  }
}
