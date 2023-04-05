import type { Meta, StoryObj } from '@storybook/react'

import { DeviceList } from './DeviceList.js'

/**
 * # DeviceList stories
 * These stories showcase the device list.
 */
const meta: Meta<typeof DeviceList> = {
  title: 'Example/DeviceList',
  component: DeviceList,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof DeviceList>

/**
 * # List of devices
 * This is a list of devices.
 */
export const Devices: Story = {}
