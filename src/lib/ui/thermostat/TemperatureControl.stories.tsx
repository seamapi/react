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
          temperature={heatF}
          onChange={(temperature) => {
            setHeatF(temperature)
          }}
        />

        <TemperatureControl
          variant='cool'
          temperature={coolF}
          onChange={(temperature) => {
            setCoolF(temperature)
          }}
        />

        <TemperatureControl
          variant='heat'
          temperature={heatC}
          onChange={(temperature) => {
            setHeatC(temperature)
          }}
          min={10}
          max={30}
          temperatureUnit='celsius'
        />

        <TemperatureControl
          variant='cool'
          temperature={coolC}
          onChange={(temperature) => {
            setCoolC(temperature)
          }}
          min={10}
          max={30}
          temperatureUnit='celsius'
        />
      </Box>
    )
  },
}

export default meta
