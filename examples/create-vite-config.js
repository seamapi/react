import { dirname } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

/** @type {(url: string) => import('vite').ResolvedConfig} */
export default (url) =>
  defineConfig(({ mode }) => {
    const endpoint =
      mode === 'production' ? 'https://connect.getseam.com' : '/api'
    env.SEAM_ENDPOINT ??= endpoint
    return {
      envPrefix: 'SEAM_',
      root: dirname(fileURLToPath(url)),
      plugins: [tsconfigPaths(), react()],
      server: {
        port: 8080,
        proxy: {
          '/api': {
            target: endpoint,
            rewrite: (path) => path.replace(/^\/api/, ''),
            changeOrigin: true,
          },
        },
      },
    }
  })
