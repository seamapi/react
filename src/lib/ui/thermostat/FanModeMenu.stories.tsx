import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { FanModeMenu } from './FanModeMenu.js'

const meta: Meta<typeof FanModeMenu> = {
  title: 'Library/FanModeMenu',
  tags: ['autodocs'],
  component: FanModeMenu,
}

type Story = StoryObj<typeof FanModeMenu>

export const Content: Story = {
  render: () => {
    const [mode, setMode] = useState<'auto' | 'on'>('auto')

    return (
      <Box height={120}>
        <FanModeMenu mode={mode} onChange={(mode) => setMode(mode)} />
      </Box>
    )
  },
}

export default meta
