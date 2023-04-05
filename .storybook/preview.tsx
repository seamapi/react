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
  decorators: [
    (Story) => (
      <SeamProvider publishableKey='test-key'>
        <Story />
      </SeamProvider>
    )
  ]
}

export default preview
