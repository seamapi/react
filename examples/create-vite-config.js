import { basename, dirname } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

/** @type {(url: string) => import('vite').ResolvedConfig} */
export default async (url) =>
  await defineConfig({
    envPrefix: 'SEAM_',
    base: env.CI ? `/examples/${basename(dirname(fileURLToPath(url)))}` : '/',
    root: dirname(fileURLToPath(url)),
    plugins: [tsconfigPaths(), react()],
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: 'https://connect.getseam.com',
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true,
        },
      },
    },
  })
