import { useArgs } from '@storybook/preview-api'
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
  render: (props) => {
    const [, setArgs] = useArgs()

    return (
      <Box height={120}>
        <FanModeMenu
          mode={props.mode}
          onChange={(mode) => {
            setArgs({ mode })
          }}
        />
      </Box>
    )
  },
}

export default meta
