import { readdirSync } from 'node:fs'

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
  webpackFinal: async (config) => {
    webpackTsconfigpaths(config)

    if (config?.plugins == null) config.plugins = []

    const examples = readdirSync('examples', { withFileTypes: true })
      .filter((f) => f.isDirectory())
      .map((f) => f.name)

    if (examples.length === 0) {
      throw new Error('Excepted at least one example')
    }

    for (const example of examples) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            { from: `examples/${example}/dist`, to: 'examples/basic' },
          ],
        })
      )
    }

    return config
  },
}

export default config
