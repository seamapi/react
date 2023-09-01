import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { useDevice } from '../../../hooks.js'
import { ThermostatCard } from './ThermostatCard.js'

const meta: Meta<typeof ThermostatCard> = {
  title: 'Library/ThermostatCard',
  tags: ['autodocs'],
  component: ThermostatCard,
}

type Story = StoryObj<typeof ThermostatCard>

export const Content: Story = {
  render: () => {
    const { device } = useDevice({
      device_id: 'device5',
    })

    if (device == null) return <></>

    return (
      <Box display='grid' gap={4} gridTemplateColumns='repeat(4, min-content)'>
        <ThermostatCard device={device} />
      </Box>
    )
  },
}

export default meta