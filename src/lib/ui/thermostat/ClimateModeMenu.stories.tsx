import { Box } from '@mui/material'
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { ClimateModeMenu } from './ClimateModeMenu.js'

const meta: Meta<typeof ClimateModeMenu> = {
  title: 'Library/ClimateModeMenu',
  tags: ['autodocs'],
  component: ClimateModeMenu,
}

type Story = StoryObj<typeof ClimateModeMenu>

export const Content: Story = {
  render: (props) => {
    const [, setArgs] = useArgs()

    return (
      <Box height={190}>
        <ClimateModeMenu
          mode={props.mode ?? 'heat'}
          onChange={(mode) => {
            setArgs({ mode })
          }}
        />
      </Box>
    )
  },
}

export default meta
