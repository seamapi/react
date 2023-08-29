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
    const [heatF, setHeatF] = useState(70)
    const [coolF, setCoolF] = useState(70)
    const [heatC, setHeatC] = useState(20)
    const [coolC, setCoolC] = useState(20)

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
          value={heatF}
          onChange={(value) => {
            setHeatF(value)
          }}
        />

        <TemperatureControl
          variant='cool'
          value={coolF}
          onChange={(value) => {
            setCoolF(value)
          }}
        />

        <TemperatureControl
          variant='heat'
          value={heatC}
          onChange={(value) => {
            setHeatC(value)
          }}
          min={10}
          max={30}
          unit='celsius'
        />

        <TemperatureControl
          variant='cool'
          value={coolC}
          onChange={(value) => {
            setCoolC(value)
          }}
          min={10}
          max={30}
          unit='celsius'
        />
      </Box>
    )
  },
}

export default meta
