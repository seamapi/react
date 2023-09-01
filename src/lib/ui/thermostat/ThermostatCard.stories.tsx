import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { isThermostatDevice } from 'seamapi'

import { useDevice } from 'lib/seam/devices/use-device.js'

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
    if (!isThermostatDevice(device)) return <></>

    return (
      <Box maxWidth={468}>
        <ThermostatCard device={device} />
      </Box>
    )
  },
}

export default meta
