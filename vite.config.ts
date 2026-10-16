import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import replace, { type RollupReplaceOptions } from '@rollup/plugin-replace'
import react from '@vitejs/plugin-react'
import {
  defineConfig,
  type Plugin,
  transformWithEsbuild,
  type UserConfig,
} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// Each library entry is built separately so every bundle is self-contained.
// Build the ecosystem entry with `vite build --mode ecosystem`.
const libraryEntries = {
  production: 'elements',
  ecosystem: 'ecosystem',
} as const

export default defineConfig(async ({ mode }) => {
  const libraryEntry = isLibraryMode(mode) ? libraryEntries[mode] : 'elements'
  const isBuild = isLibraryMode(mode)
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
      ...(libraryEntry === 'ecosystem' ? [minifyLibrary()] : []),
    ],
    build: {
      outDir: fileURLToPath(new URL('./dist', import.meta.url)),
      sourcemap: true,
      emptyOutDir: false,
      lib: {
        entry: fileURLToPath(
          new URL(`./src/${libraryEntry}.ts`, import.meta.url)
        ),
        fileName: libraryEntry,
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

// UPSTREAM: Vite never minifies whitespace in ES library builds.
// The ecosystem bundle is only loaded as a script, so minify it fully.
// https://github.com/vitejs/vite/issues/6555
const minifyLibrary = (): Plugin => ({
  name: 'seam:minify-library',
  apply: 'build',
  renderChunk: {
    order: 'post',
    async handler(code, chunk) {
      const { code: minified, map } = await transformWithEsbuild(
        code,
        chunk.fileName,
        { minify: true, format: 'esm', sourcemap: true }
      )
      return { code: minified, map }
    },
  },
})

const isLibraryMode = (mode: string): mode is keyof typeof libraryEntries =>
  Object.keys(libraryEntries).includes(mode)

export const readPackageJson = async (): Promise<{ version?: string }> => {
  const pkgBuff = await readFile(
    fileURLToPath(new URL('package.json', import.meta.url))
  )
  return JSON.parse(pkgBuff.toString())
}

export const versionFiles = ['./README.md']

export const versionPlaceholder = '_________VERSION_________'
