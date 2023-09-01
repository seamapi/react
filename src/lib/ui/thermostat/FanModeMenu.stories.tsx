import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { FanModeMenu } from './FanModeMenu.js'

const meta: Meta<typeof FanModeMenu> = {
  title: 'Library/FanModeMenu',
  tags: ['autodocs'],
  component: FanModeMenu,
}

type Story = StoryObj<typeof FanModeMenu>

export const Content: Story = {
  render: () => {
    return (
      <Box
        display='grid'
        gap={4}
        gridTemplateColumns='repeat(4, min-content)'
        height={400}
      >
        <FanModeMenu />
      </Box>
    )
  },
}

export default meta
