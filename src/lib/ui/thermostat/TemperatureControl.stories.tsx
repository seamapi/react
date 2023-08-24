import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { TemperatureControl } from './TemperatureControl.js'

const meta: Meta<typeof TemperatureControl> = {
  title: 'Library/TemperatureControl',
  tags: ['autodocs'],
  component: TemperatureControl,
}

type Story = StoryObj<typeof TemperatureControl>

export const Content: Story = {
  render: () => {
    return (
      <Box display='grid' gap={4} gridTemplateColumns='repeat(4, min-content)'>
        <TemperatureControl />
      </Box>
    )
  },
}

export default meta
