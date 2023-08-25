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
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <TemperatureControl variant='heat' />
        <TemperatureControl variant='cool' />
      </Box>
    )
  },
}

export default meta
