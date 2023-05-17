import '../src/index.scss'

import { SeamProvider } from '@seamapi/react'
import type { Preview } from '@storybook/react'

import { fakePublishableKey, fakeUserIdentifierKey } from './seed-fake.js'

const preview: Preview = {
  globalTypes: {
    publishableKey: {
      description: 'Seam publishable key',
      defaultValue:
        process.env['STORYBOOK_SEAM_PUBLISHABLE_KEY'] ?? fakePublishableKey,
    },
    userIdentifierKey: {
      description: 'Seam user identifier key',
      defaultValue:
        process.env['STORYBOOK_SEAM_USER_IDENTIFIER_KEY'] ??
        fakeUserIdentifierKey,
    },
  },
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
    (Story, { globals: { publishableKey, userIdentifierKey } }) => {
      return (
        <SeamProvider
          publishableKey={publishableKey}
          userIdentifierKey={userIdentifierKey}
          {...(process.env['NODE_ENV'] === 'production'
            ? {}
            : { endpoint: '/api' })}
        >
          <Story />
        </SeamProvider>
      )
    },
  ],
}

export default preview
