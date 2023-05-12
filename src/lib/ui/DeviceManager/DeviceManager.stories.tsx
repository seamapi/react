import type { Meta, StoryObj } from '@storybook/react'

import { DeviceManager } from 'lib/ui/DeviceManager/DeviceManager.js'

/**
 * # DeviceManager stories
 * These stories showcase the device manager.
 */
const meta: Meta<typeof DeviceManager> = {
  title: 'Example/DeviceManager',
  component: DeviceManager,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DeviceManager>

/**
 * # List of devices
 * This is a list of devices.
 */
export const Devices: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Su3VO6yupz4yxe88fv0Uqa/Out-of-the-box-Components?node-id=358-43308&t=nQzUZZTb5FddESkl-4',
    },
  },
}
