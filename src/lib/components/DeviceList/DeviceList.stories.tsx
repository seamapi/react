import type { Meta, StoryObj } from '@storybook/react'

import { DeviceList } from './DeviceList.js'

const meta: Meta<typeof DeviceList> = {
  title: 'Example/DeviceList',
  component: DeviceList,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof DeviceList>

export const Devices: Story = {}
