import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  define: {
    'process.env.NODE_ENV': "'production'",
  },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('./src/elements.ts', import.meta.url)),
      fileName: 'elements',
      formats: ['es'],
    },
  },
})
