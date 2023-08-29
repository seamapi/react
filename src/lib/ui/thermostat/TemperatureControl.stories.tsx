import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { TemperatureControl } from './TemperatureControl.js'

const meta: Meta<typeof TemperatureControl> = {
  title: 'Library/TemperatureControl',
  tags: ['autodocs'],
  component: TemperatureControl,
}

type Story = StoryObj<typeof TemperatureControl>

export const Content: Story = {
  render: () => {
    const [heat, setHeat] = useState(70)
    const [cool, setCool] = useState(75)

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
        <TemperatureControl
          variant='heat'
          temperature={heat}
          onChange={(temperature) => { setHeat(temperature); }}
        />

        <TemperatureControl
          variant='cool'
          temperature={cool}
          onChange={(temperature) => { setCool(temperature); }}
        />
      </Box>
    )
  },
}

export default meta
