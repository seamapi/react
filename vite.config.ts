import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import replace, { type RollupReplaceOptions } from '@rollup/plugin-replace'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(async ({ mode }) => {
  const isBuild = mode === 'production'
  const { version = null } = isBuild ? await readPackageJson() : {}
  if (isBuild && version == null) {
    throw new Error('Missing version in package.json')
  }
  const config: UserConfig = {
    plugins: [
      tsconfigPaths(),
      react(),
      // UPSTREAM: Rollup plugins have broken type declarations.
      // https://github.com/rollup/plugins/issues/1541
      (replace as unknown as (options: RollupReplaceOptions) => Plugin)(
        isBuild
          ? {
              preventAssignment: true,
              'process.env.NODE_ENV': JSON.stringify('production'),
              'const seamapiReactVersion = null': `const seamapiReactVersion = '${version}'`,
            }
          : { preventAssignment: true }
      ),
    ],
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
    test: {
      setupFiles: ['./test/fixtures/api.ts'],
      environment: 'happy-dom',
      deps: {
        interopDefault: false,
        web: {
          transformCss: false,
          transformAssets: false,
        },
      },
      coverage: {
        provider: 'v8',
      },
    },
  }
  return config
})

export const readPackageJson = async (): Promise<{ version?: string }> => {
  const pkgBuff = await readFile(
    fileURLToPath(new URL('package.json', import.meta.url))
  )
  return JSON.parse(pkgBuff.toString())
}

export const versionFiles = ['./README.md']

export const versionPlaceholder = '_________VERSION_________'
