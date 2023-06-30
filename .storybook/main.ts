import type { StorybookConfig } from '@storybook/react-webpack5'
import CopyPlugin from 'copy-webpack-plugin'
import sass from 'sass'

import CspPlugin from './webpack-csp.js'
import webpackTsconfigpaths from './webpack-tsconfigpaths.js'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['./public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-designs',
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          implementation: sass,
          includePaths: ['node_modules'],
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config, { configType }) => {
    webpackTsconfigpaths(config)

    if (config?.plugins == null) config.plugins = []

    if (configType === 'PRODUCTION') {
      config.plugins.push(
        new CopyPlugin({
          patterns: [{ from: `examples/dist`, to: 'examples' }],
        })
      )

      config.plugins.push(new CspPlugin())
    }

    return config
  },
}

export default config
