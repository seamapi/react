// eslint-disable-next-line import/no-relative-parent-imports
import '../src/index.scss'

import { SeamProvider } from '@seamapi/react'
import type { Preview } from '@storybook/react'

const seamEndpoint = process.env['STORYBOOK_SEAM_ENDPOINT'] ?? '/api'

const preview: Preview = {
  globalTypes: {
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
    (Story, context) => {
      const {
        globals: { simulatedOutage },
      } = context

      const publishableKey =
        simulatedOutage === 'outage' ? 'seam_pk_3' : 'seam_pk_2'

      return (
        <SeamProvider
          publishableKey={publishableKey}
          userIdentifierKey='some_user'
          endpoint={seamEndpoint}
          disableCssInjection
          disableFontInjection
        >
          <Story {...context} />
        </SeamProvider>
      )
    },
  ],
}

export default preview
