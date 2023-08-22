import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { Tooltip } from 'lib/ui/Tooltip/Tooltip.js'

const meta: Meta<typeof Tooltip> = {
  title: 'Library/Tooltip',
  component: Tooltip,
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consectetur, nisl ut sodales ultricies, elit elit vehicula nunc, eget blandit nunc tortor eu nibh.',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
}

type Story = StoryObj<typeof Tooltip>

export const Content: Story = {
  render: (props) => {
    return (
      <Box
        sx={{
          height: '150px',
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'flex-end',
          flexDirection: 'column',
        }}
      >
        <div>
          <Tooltip {...props}>{props.children}</Tooltip>
        </div>
      </Box>
    )
  },
}

export default meta
