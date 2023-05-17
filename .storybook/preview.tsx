import '../src/index.scss'

import { SeamProvider } from '@seamapi/react'
import type { Preview } from '@storybook/react'

const useFake =
  !(['1', 'true'].includes(
    process.env['STORYBOOK_DISABLE_FAKE']?.toLowerCase() ?? ''
  ))

const preview: Preview = {
  globalTypes: {
    /** @deprecated use "some_publishable_key" **/
    publishableKey: {
      description: 'Seam publishable key',
      defaultValue: useFake
        ? 'some_publishable_key'
        : process.env['STORYBOOK_SEAM_PUBLISHABLE_KEY'],
    },
    /** @deprecated use "some_user_identifier_key" **/
    userIdentifierKey: {
      description: 'Seam user identifier key',
      defaultValue: useFake
        ? 'some_user_identifier_key'
        : process.env['STORYBOOK_SEAM_USER_IDENTIFIER_KEY'],
    },
    /** @deprecated use "device1" **/
    deviceId: {
      description: 'Device id',
      defaultValue: useFake
        ? 'device1'
        : 'f9a9ab36-9e14-4390-a88c-b4c78304c6aa',
    },
    /** @deprecated use "access_code1" **/
    accessCodeId: {
      description: 'Access code id',
      defaultValue: useFake
        ? 'access_code1'
        : 'a4d00b36-09e2-467f-a9f3-bb73cea1351c',
    },
    seamEndpoint: {
      description: 'Seam Endpoint',
      defaultValue: useFake ? '/api' : process.env['STORYBOOK_SEAM_ENDPOINT'],
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
    (
      Story,
      { globals: { publishableKey, userIdentifierKey, seamEndpoint } }
    ) => {
      return (
        <SeamProvider
          publishableKey={publishableKey}
          userIdentifierKey={userIdentifierKey}
          endpoint={seamEndpoint}
        >
          <Story />
        </SeamProvider>
      )
    },
  ],
}

export default preview
