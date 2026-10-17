import type { Meta, StoryObj } from '@storybook/react'

import {
  CompatibleApps,
  type CompatibleAppsProps,
} from 'lib/seam/components/CompatibleApps/CompatibleApps.js'
import {
  type EcosystemStoryArgs,
  storybookEmbedKeys,
  withDarkBackground,
  withFakeEcosystem,
} from 'lib/ui/ecosystem/storybook.js'

type Args = CompatibleAppsProps & EcosystemStoryArgs

/**
 * The apps (Seam partners) that work with a device category, manufacturer,
 * provider or capability through Seam, from the Seam Ecosystem PartnerDB.
 *
 * > **💡 The Storybook uses a fake Ecosystem API with fictional partners.**
 *
 * Add it to any page with the lightweight Ecosystem bundle:
 *
 * ```html
 * <seam-compatible-apps
 *   embed-key="eco_live_your_embed_key"
 *   device-type="smartlock"
 *   manufacturer="schlage"
 * ></seam-compatible-apps>
 * <script
 *   type="module"
 *   src="https://react.seam.co/v/x.y.z/dist/ecosystem.js"
 * ></script>
 * ```
 *
 * Replace `x.y.z` with the exact version of `@seamapi/react` to use.
 */
const meta: Meta<Args> = {
  title: 'Ecosystem/CompatibleApps',
  component: CompatibleApps,
  tags: ['autodocs'],
  decorators: [withFakeEcosystem],
  args: {
    embedKey: storybookEmbedKeys.seam,
    deviceType: 'smartlock',
  },
  argTypes: {
    embedKey: {
      control: 'text',
      description:
        'Seam Ecosystem embed key. Set on the provider, or as the embed-key attribute.',
    },
    theme: {
      control: 'inline-radio',
      options: ['light', 'dark', 'auto'],
    },
  },
}

export default meta

type Story = StoryObj<Args>

export const Smartlocks: Story = {}

export const SchlageOnly: Story = {
  args: { manufacturer: 'schlage' },
}

export const ThermostatsForShortTermRental: Story = {
  args: { deviceType: 'thermostat', industry: 'short-term-rental' },
}

export const SaltoKsMobileKeys: Story = {
  args: { provider: 'salto-ks', capability: 'can_provision_mobile_keys' },
}

export const ShowMore: Story = {
  args: { maxVisible: 4 },
}

export const DarkMode: Story = {
  args: { theme: 'dark' },
  decorators: [withDarkBackground],
}

export const WithoutTitleOrSearch: Story = {
  args: { hideTitle: true, hideSearch: true },
}

export const EmptyState: Story = {
  args: { deviceType: 'camera' },
}

export const InvalidEmbedKey: Story = {
  args: { embedKey: storybookEmbedKeys.invalid },
}

export const MissingEmbedKey: Story = {
  args: { embedKey: '' },
}

export const DisallowedOrigin: Story = {
  args: { embedKey: storybookEmbedKeys.wrongOrigin },
}
