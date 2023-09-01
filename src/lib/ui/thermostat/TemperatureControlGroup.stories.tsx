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
        <Box
          sx={{
            display: 'flex',
            padding: '16px',
            backgroundColor: '#f7f7f7',
          }}
        >
          <TemperatureControlGroup mode='heatcool' />
        </Box>
        <Box
          sx={{
            display: 'flex',
            padding: '16px',
            backgroundColor: '#f7f7f7',
          }}
        >
          <TemperatureControlGroup mode='heat' />
        </Box>
        <Box
          sx={{
            display: 'flex',
            padding: '16px',
            backgroundColor: '#f7f7f7',
          }}
        >
          <TemperatureControlGroup mode='cool' />
        </Box>
      </Box>
    )
  },
}

export default meta
