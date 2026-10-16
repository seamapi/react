import type { Meta, StoryObj } from '@storybook/react'

import {
  SupportedDevices,
  type SupportedDevicesProps,
} from 'lib/seam/components/SupportedDevices/SupportedDevices.js'
import {
  type EcosystemStoryArgs,
  storybookEmbedKeys,
  withDarkBackground,
  withFakeEcosystem,
} from 'lib/ui/ecosystem/storybook.js'

type Args = SupportedDevicesProps & EcosystemStoryArgs

/**
 * Device models that work with Seam, grouped by manufacturer,
 * from the Seam Ecosystem DeviceDB.
 *
 * > **💡 The Storybook uses a fake Ecosystem API with sample device models.**
 *
 * Add a manufacturer's device list to a product page with the lightweight Ecosystem bundle:
 *
 * ```html
 * <seam-supported-devices
 *   embed-key="eco_live_your_embed_key"
 *   manufacturer="schlage"
 * ></seam-supported-devices>
 * <script
 *   type="module"
 *   src="https://react.seam.co/v/x.y.z/dist/ecosystem.js"
 * ></script>
 * ```
 *
 * Replace `x.y.z` with the exact version of `@seamapi/react` to use.
 *
 * With a manufacturer embed key, the list defaults to that manufacturer.
 * With a partner embed key, the partner's declared exclusions are hidden.
 */
const meta: Meta<Args> = {
  title: 'Ecosystem/SupportedDevices',
  component: SupportedDevices,
  tags: ['autodocs'],
  decorators: [withFakeEcosystem],
  args: {
    embedKey: storybookEmbedKeys.seam,
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

export const AllDevices: Story = {}

export const SingleManufacturer: Story = {
  args: { manufacturer: 'schlage' },
}

export const ManufacturerEmbedKey: Story = {
  args: { embedKey: storybookEmbedKeys.manufacturer },
}

export const Thermostats: Story = {
  args: { deviceType: 'thermostat' },
}

export const MobileKeys: Story = {
  args: { capability: 'can_provision_mobile_keys' },
}

export const PartnerEmbedKey: Story = {
  args: { embedKey: storybookEmbedKeys.partner, deviceType: 'smartlock' },
}

export const DarkMode: Story = {
  args: { manufacturer: 'schlage', theme: 'dark' },
  decorators: [withDarkBackground],
}

export const WithoutFilters: Story = {
  args: { hideFilters: true, hideSearch: true },
}

export const EmptyState: Story = {
  args: { manufacturer: 'not-a-manufacturer' },
}

export const InvalidEmbedKey: Story = {
  args: { embedKey: storybookEmbedKeys.invalid },
}
