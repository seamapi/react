import type { Meta, StoryObj } from '@storybook/react'

import DeviceManager from 'lib/ui/DeviceManager/index.js'

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
export const Devices: Story = {}
