import type { Preview } from '@storybook/react'
import { CacheProvider, createCache } from '@storybook/theming'

import { SeamProvider } from 'index.js'

// UPSTREAM: Use toolbar input when it lands.
// https://github.com/storybookjs/storybook/pull/21959
const defaultPublishableKey =
  process.env['STORYBOOK_SEAM_PUBLISHABLE_KEY'] ??
  'seam_pk1fGd41X_zKs0ZELRWEc8nWxiBsrTFC98'

const endpoint = process.env['STORYBOOK_SEAM_ENDPOINT'] ?? '/api'

const cache = createCache({
  key: 'prefix',
  nonce: 'nonce-storybook',
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <CacheProvider value={cache}>
          <SeamProvider
            publishableKey={defaultPublishableKey}
            endpoint={endpoint}
          >
            <Story />
          </SeamProvider>
        </CacheProvider>
      )
    },
  ],
}

export default preview
