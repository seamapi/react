import '../src/index.scss'

import { SeamProvider } from '@seamapi/react'
import type { Preview } from '@storybook/react'

import { fakePublishableKey, fakeUserIdentifierKey } from './seed-fake.js'

const publishableKey =
  process.env['STORYBOOK_SEAM_PUBLISHABLE_KEY'] ?? fakePublishableKey

const userIdentifierKey =
  process.env['STORYBOOK_SEAM_USER_IDENTIFIER_KEY'] ?? fakeUserIdentifierKey

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
      // TODO: This should be given by the story, some stories will want
      // to use different publishable keys, user identifiers etc. to simulate
      // different scenarios
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
