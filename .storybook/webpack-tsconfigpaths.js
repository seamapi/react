import { existsSync } from 'node:fs'
import { join, parse, resolve } from 'node:path'

import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import { NormalModuleReplacementPlugin } from 'webpack'

// UPSTREAM: https://github.com/storybookjs/storybook/issues/14274
// Workaround from https://github.com/vercel/next.js/issues/41961#issuecomment-1311091390
/** @type {(config: import('webpack').Configuration) => void} */
export default (config) => {
  if (config?.plugins == null) config.plugins = []
  config.plugins.push(
    new NormalModuleReplacementPlugin(/\.js$/, (resource) => {
      if (resource.request.startsWith('.')) {
        const path = resolve(resource.context, resource.request)

        if (!path.includes('node_modules') && !existsSync(path)) {
          const { dir, name } = parse(path)
          const extensionlessPath = join(dir, name)

          for (const fallbackExtension of ['.tsx', '.ts', '.js']) {
            const fallback = `${extensionlessPath}${fallbackExtension}`
            if (existsSync(fallback)) {
              resource.request = resource.request.replace(
                /\.js$/,
                fallbackExtension
              )
              break
            }
          }
        }
      }
    })
  )

  config.plugins.push(
    new NormalModuleReplacementPlugin(/^lib\/.*js$/, (resource) => {
      resource.request = resource.request.replace(/\.js$/, '')
    })
  )

  config.plugins.push(
    new NormalModuleReplacementPlugin(/^@seamapi\/react$/, (resource) => {
      resource.request = 'src/index.ts'
    })
  )

  if (config?.resolve == null) config.resolve = {}
  if (config?.resolve?.plugins == null) config.resolve.plugins = []
  config.resolve.plugins.push(new TsconfigPathsPlugin({ baseUrl: '.' }))
}
