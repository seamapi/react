import { Box } from '@mui/material'
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { Snackbar } from 'lib/ui/Snackbar/Snackbar.js'

const meta: Meta<typeof Snackbar> = {
  title: 'Library/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  args: {
    message: 'An unknown error occurred.',
    variant: 'success',
    isOpen: true,
    onClose: () => {},
    action: {
      label: 'Retry',
      onClick: () => {},
    },
  },
  argTypes: {
    message: {
      control: { type: 'text' },
    },
    variant: {
      control: {
        type: 'select',
        options: ['success', 'error'],
      },
    },
    isOpen: {
      control: { type: 'boolean' },
    },
    onClose: {
      control: { type: 'function' },
    },
    action: {
      control: { type: 'object' },
    },
  },
}

type Story = StoryObj<typeof Snackbar>

export const Content: Story = {
  render: (props) => {
    const [, setArgs] = useArgs()

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1rem',
        }}
      >
        <Snackbar
          {...props}
          isOpen={props.isOpen}
          onClose={() => { setArgs({ isOpen: false }); }}
        />
      </Box>
    )
  },
}

export default meta
