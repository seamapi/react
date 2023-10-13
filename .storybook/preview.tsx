// eslint-disable-next-line import/no-relative-parent-imports
import '../src/index.scss'

import { SeamProvider } from '@seamapi/react'
import type { Preview } from '@storybook/react'

import { fakePublishableKey } from './seed-fake.js'

const useFake = !['1', 'true'].includes(
  process.env['STORYBOOK_DISABLE_FAKE']?.toLowerCase() ?? ''
)

const preview: Preview = {
  globalTypes: {
    /** @deprecated use "seam_pk_1" directly in your story **/
    publishableKey: {
      description: 'Seam publishable key',
      defaultValue: useFake
        ? fakePublishableKey
        : process.env['STORYBOOK_SEAM_PUBLISHABLE_KEY'],
    },
    /** @deprecated use "some_user" directly in your story **/
    userIdentifierKey: {
      description: 'Seam user identifier key',
      defaultValue: useFake
        ? 'some_user'
        : process.env['STORYBOOK_SEAM_USER_IDENTIFIER_KEY'],
    },
    /** @deprecated use "device1" directly in your story **/
    deviceId: {
      description: 'Device id',
      defaultValue: useFake
        ? 'device1'
        : 'f9a9ab36-9e14-4390-a88c-b4c78304c6aa',
    },
    /** @deprecated use "access_code1" directly in your story **/
    accessCodeId: {
      description: 'Access code id',
      defaultValue: useFake
        ? 'access_code1'
        : 'a4d00b36-09e2-467f-a9f3-bb73cea1351c',
    },
    seamEndpoint: {
      description: 'Seam Endpoint',
      defaultValue: process.env['STORYBOOK_SEAM_ENDPOINT'] ?? '/api',
    },
    simulatedOutage: {
      description: 'Simulate an outage',
      defaultValue: 'normal',
      toolbar: {
        items: [
          { value: 'normal', icon: 'lightning', title: 'Normal' },
          { value: 'outage', icon: 'lightningoff', title: 'Outage' },
        ],
      },
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
      {
        globals: {
          publishableKey,
          userIdentifierKey,
          seamEndpoint,
          simulatedOutage,
        },
      }
    ) => {
      return (
        <SeamProvider
          publishableKey={
            simulatedOutage === 'outage' ? 'seam_pk_3' : publishableKey
          }
          userIdentifierKey={userIdentifierKey}
          endpoint={seamEndpoint}
          disableCssInjection
          disableFontInjection
        >
          <Story />
        </SeamProvider>
      )
    },
  ],
}

export default preview
