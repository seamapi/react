import type { Meta, StoryObj } from '@storybook/react'

import { SupportedDeviceTableManufacturerKeys } from './SupportedDeviceTableManufacturerKeys.js'

/**
 * These stories showcase the supported devices table.
 */
const meta: Meta<typeof SupportedDeviceTableManufacturerKeys> = {
  title: 'Components/SupportedDeviceTableManufacturerKeys',
  component: SupportedDeviceTableManufacturerKeys,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SupportedDeviceTableManufacturerKeys>

export const Content: Story = {}
