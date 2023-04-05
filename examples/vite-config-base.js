import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default (url) =>
  defineConfig({
    root: dirname(fileURLToPath(url)),
    plugins: [tsconfigPaths(), react()]
  })
