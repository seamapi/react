import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { ThermostatCard } from './ThermostatCard.js'

const meta: Meta<typeof ThermostatCard> = {
  title: 'Library/ThermostatCard',
  tags: ['autodocs'],
  component: ThermostatCard,
}

type Story = StoryObj<typeof ThermostatCard>

export const Content: Story = {
  render: (props, { globals }) => {
    return (
      <Box display='grid' gap={4} gridTemplateColumns='repeat(4, min-content)'>
        <ThermostatCard deviceId={props.deviceId || globals['deviceId']} />
      </Box>
    )
  },
}

export default meta
