import { type Meta, type StoryObj } from '@storybook/react'

import { DeviceManager } from './DeviceManager.js'

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
