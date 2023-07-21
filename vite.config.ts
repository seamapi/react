import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(async () => {
  const { version } = await readPackageJson()
  if (version == null) {
    throw new Error('Missing version in package.json')
  }
  return {
    plugins: [
      tsconfigPaths(),
      // @ts-expect-error https://github.com/vitejs/vite-plugin-react/issues/104
      react(),
    ],
    define: {
      'process.env.NODE_ENV': "'production'",
      'const seamapiReactVersion = null': `const seamapiReactVersion = '${version}'`,
    },
    build: {
      outDir: fileURLToPath(new URL('./dist', import.meta.url)),
      sourcemap: true,
      emptyOutDir: false,
      lib: {
        entry: fileURLToPath(new URL('./src/elements.ts', import.meta.url)),
        fileName: 'elements',
        formats: ['es'],
      },
    },
  }
})

export const readPackageJson = async (): Promise<{ version?: string }> => {
  const pkgBuff = await readFile(
    fileURLToPath(new URL('package.json', import.meta.url))
  )
  return JSON.parse(pkgBuff.toString())
}

export const versionFiles = ['./README.md']

export const versionPlaceholder = '_________VERSION_________'
