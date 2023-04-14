import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

/** @type {(url: string) => import('vite').ResolvedConfig} */
export default async (url) =>
  await defineConfig({
    envPrefix: 'SEAM_',
    root: dirname(fileURLToPath(url)),
    plugins: [tsconfigPaths(), react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://connect.getseam.com',
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true
        }
      }
    }
  })
