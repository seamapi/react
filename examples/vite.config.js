import { env } from 'node:process'
import { setTimeout } from 'node:timers/promises'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

/** @type {ResolvedConfig} */
export default defineConfig(async ({ command }) => {
  const target = 'https://connect.getseam.com'
  const isBuild = command === 'build'
  const endpoint = isBuild ? target : '/api'
  await setupEnv(endpoint, isBuild)
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

/** @type {(endpoint: string, isBuild: boolean) => Promise<void>} */
const setupEnv = async (endpoint, isBuild) => {
  env.SEAM_ENDPOINT ??= endpoint

  if (env.SEAM_PUBLISHABLE_KEY == null) {
    if (!isBuild) {
      // eslint-disable-next-line no-console
      console.warn(
        `> Using the default publishable key.
> Use your own by setting SEAM_PUBLISHABLE_KEY in your environment.
> Get one for free at https://console.seam.co/
`
      )
      await setTimeout(2000)
    }

    env.SEAM_PUBLISHABLE_KEY = 'seam_pk1fGd41X_zKs0ZELRWEc8nWxiBsrTFC98'
  }
}
