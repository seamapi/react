import type { Preview } from '@storybook/react'

import { SeamProvider } from 'index.js'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  },
  argTypes: { publishableKey: { control: { type: 'text' } } },
  args: { publishableKey: 'default_publishable_key' },
  decorators: [
    (Story, { args }) => (
      <SeamProvider publishableKey={args['publishableKey']}>
        <Story />
      </SeamProvider>
    )
  ]
}

export default preview
