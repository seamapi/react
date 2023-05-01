import type { StorybookConfig } from '@storybook/react-webpack5'
import CopyPlugin from 'copy-webpack-plugin'

import webpackTsconfigpaths from './webpack-tsconfigpaths.js'

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
  webpackFinal: async (config, { configType }) => {
    webpackTsconfigpaths(config)

    if (config?.plugins == null) config.plugins = []

    if (configType === 'PRODUCTION') {
      config.plugins.push(
        new CopyPlugin({
          patterns: [{ from: `examples/dist`, to: 'examples' }],
        })
      )
    }

    return config
  },
}

export default config
