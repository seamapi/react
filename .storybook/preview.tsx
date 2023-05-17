import '../src/index.scss'

import { SeamProvider } from '@seamapi/react'
import type { Preview } from '@storybook/react'

import { fakePublishableKey, fakeUserIdentifierKey } from './seed-fake.js'

const isProd = process.env['NODE_ENV'] === 'production'
const useFake = process.env['STORYBOOK_SEAM_ENDPOINT'] == null

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
    deviceId: {
      description: 'Device id',
      defaultValue: useFake
        ? 'device1'
        : 'f9a9ab36-9e14-4390-a88c-b4c78304c6aa',
    },
    accessCodeId: {
      description: 'Access code id',
      defaultValue: useFake
        ? 'access_code1'
        : 'a4d00b36-09e2-467f-a9f3-bb73cea1351c',
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
          {...(isProd ? {} : { endpoint: '/api' })}
        >
          <Story />
        </SeamProvider>
      )
    },
  ],
}

export default preview
