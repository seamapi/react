import { Container } from '@mui/material'
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

export const ScrollingContent: Story = {
  render: (props) => (
    <Container sx={{ height: 200 }}>
      <SupportedDeviceTableManufacturerKeys {...props} />
    </Container>
  ),
}
