import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { TemperatureControlGroup } from './TemperatureControlGroup.js'

const meta: Meta<typeof TemperatureControlGroup> = {
  title: 'Library/TemperatureControlGroup',
  tags: ['autodocs'],
  component: TemperatureControlGroup,
}

type Story = StoryObj<typeof TemperatureControlGroup>

export const Content: Story = {
  render: () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexDirection: 'column',
          gap: '64px',
        }}
      >
        <TemperatureControlGroup mode='heatcool' />
        <TemperatureControlGroup mode='heat' />
        <TemperatureControlGroup mode='cool' />
      </Box>
    )
  },
}

export default meta
