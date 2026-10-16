import type { Decorator } from '@storybook/react'

import { EcosystemProvider } from 'lib/seam/ecosystem/EcosystemProvider.js'

// Embed keys accepted by the fake Ecosystem API served at /api/ecosystem
// (.storybook/fake-ecosystem.js). The Storybook never uses a real key or production data.
export const storybookEmbedKeys = {
  seam: 'eco_live_storybook',
  partner: 'eco_live_storybook_partner',
  manufacturer: 'eco_live_storybook_schlage',
  wrongOrigin: 'eco_live_storybook_wrong_origin',
  invalid: 'eco_live_invalid',
} as const

export const storybookEcosystemEndpoint = '/api/ecosystem/v1/'

export interface EcosystemStoryArgs {
  embedKey?: string | undefined
}

/** Wraps a story in an EcosystemProvider pointed at the fake Ecosystem API. */
export const withFakeEcosystem: Decorator<EcosystemStoryArgs> = (
  Story,
  context
) => (
  <EcosystemProvider
    embedKey={context.args.embedKey}
    ecosystemEndpoint={storybookEcosystemEndpoint}
    disableCssInjection
    disableFontInjection
  >
    <Story />
  </EcosystemProvider>
)

export const withDarkBackground: Decorator = (Story) => (
  <div style={{ background: '#0b0d10', padding: 24, borderRadius: 12 }}>
    <Story />
  </div>
)
