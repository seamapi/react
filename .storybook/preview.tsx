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
  // TODO: UPSTREAM: Use toolbar input when it lands
  // https://github.com/storybookjs/storybook/pull/21959
  argTypes: { publishableKey: { control: { type: 'text' } } },
  // TODO: Use fake-seam-connect endpoint and publishableKey
  args: { publishableKey: 'seam_pk1fGd41X_zKs0ZELRWEc8nWxiBsrTFC98' },
  decorators: [
    (Story, { args }) => (
      <SeamProvider publishableKey={args['publishableKey']}>
        <Story />
      </SeamProvider>
    )
  ]
}

export default preview
