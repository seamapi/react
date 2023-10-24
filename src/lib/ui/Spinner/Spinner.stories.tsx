import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { Spinner } from 'lib/ui/Spinner/Spinner.js'

const meta: Meta<typeof Spinner> = {
  title: 'Library/Spinner',
  component: Spinner,
  args: {},
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
  },
}

type Story = StoryObj<typeof Spinner>

export const Content: Story = {
  render: (props) => {
    return (
      <Box display='grid' gap={3} gridTemplateColumns='repeat(3, min-content)'>
        <Spinner {...props} />
      </Box>
    )
  },
}

export default meta
