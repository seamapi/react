import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { Temperature } from './Temperature.js'

const meta: Meta<typeof Temperature> = {
  title: 'Library/Temperature',
  tags: ['autodocs'],
  component: Temperature,
}

type Story = StoryObj<typeof Temperature>

export const Content: Story = {
  render: () => {
    return (
      <Box display='grid' gap={4} gridTemplateColumns='repeat(4, min-content)'>
        <Temperature fahrenheit={72} celsius={22} unit='fahrenheit' />
        <Temperature fahrenheit={72} celsius={22} unit='celsius' />
      </Box>
    )
  },
}

export default meta
