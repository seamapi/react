import { basename, dirname } from 'node:path'
import { env } from 'node:process'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import glob from 'fast-glob'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const base = 'examples'
const target = 'https://connect.getseam.com'

export default defineConfig(async ({ command, mode }) => {
  const isBuild = command === 'build'
  const useFake = mode === 'storybook'
  const endpoint = isBuild ? target : '/api'
  await setupEnv(endpoint, isBuild, useFake)
  return {
    base: `/${base}`,
    envPrefix: 'SEAM_',
    plugins: [
      tsconfigPaths(),
      // @ts-expect-error https://github.com/vitejs/vite-plugin-react/issues/104
      react(),
    ],
    resolve: {
      alias: {
        '@seamapi/react/index.css': fileURLToPath(
          new URL('../src/index.scss', import.meta.url)
        ),
      },
    },
    build: {
      rollupOptions: {
        // UPSTREAM: https://github.com/vitejs/vite/issues/3429
        input: Object.fromEntries(
          glob
            .sync([`./${base}/**/*.html`], {
              ignore: ['**/dist/**'],
              absolute: true,
            })
            .map((file) => [
              basename(dirname(file)),
              fileURLToPath(new URL(file, import.meta.url)),
            ])
            .map(([k, v]) => [k === base ? 'main' : k, v])
        ),
      },
    },
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

const setupEnv = async (
  endpoint: string,
  isBuild: boolean,
  useFake: boolean
): Promise<void> => {
  if (useFake) {
    env['SEAM_ENDPOINT'] = endpoint
    env['SEAM_PUBLISHABLE_KEY'] = 'seam_pk1ws2_0000'
    env['SEAM_USER_IDENTIFIER_KEY'] = 'seed_client_session_user_2'
    return
  }

  env['SEAM_ENDPOINT'] ??= endpoint

  if (env['SEAM_PUBLISHABLE_KEY'] == null) {
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

    env['SEAM_PUBLISHABLE_KEY'] = 'seam_pk1J0Bgui_oYEuzDhOqUzSBkrPmrNsUuKL'
    env['SEAM_USER_IDENTIFIER_KEY'] = '64e429b6-8fcd-42d0-a17f-136854e450be'
  }

  if (env['SEAM_USER_IDENTIFIER_KEY'] == null) {
    env['SEAM_USER_IDENTIFIER_KEY'] = 'f61731b1-48a3-4b61-8767-e6268c17269c'
  }
}
