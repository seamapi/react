import '../src/index.scss'

import { SeamProvider } from '@seamapi/react'
import type { Preview } from '@storybook/react'

// UPSTREAM: Use toolbar input when it lands.
// https://github.com/storybookjs/storybook/pull/21959
const defaultPublishableKey =
  process.env['STORYBOOK_SEAM_PUBLISHABLE_KEY'] ?? 'seam_pk1ws2_0000'

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
          publishableKey={defaultPublishableKey}
          userIdentifierKey='seed_client_session_user_2'
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
