import { existsSync } from 'node:fs'
import { join, parse, resolve } from 'node:path'

import type { StorybookConfig } from '@storybook/react-webpack5'
import { NormalModuleReplacementPlugin } from 'webpack'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['./public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-designs',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  // UPSTREAM: https://github.com/storybookjs/storybook/issues/14274
  // Workaround from https://github.com/vercel/next.js/issues/41961#issuecomment-1311091390
  webpackFinal: async (config) => {
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
      new NormalModuleReplacementPlugin(/^index\.js$/, (resource) => {
        resource.request = 'src/index.ts'
      })
    )

    if (config?.resolve == null) config.resolve = {}
    if (config?.resolve?.plugins == null) config.resolve.plugins = []
    config.resolve.plugins.push(new TsconfigPathsPlugin({ baseUrl: '.' }))

    return config
  },
}

export default config
