import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { Snackbar } from 'lib/ui/Snackbar/Snackbar.js'

const meta: Meta<typeof Snackbar> = {
  title: 'Library/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  args: {
    message: 'An unknown error occurred.',
    variant: 'error',
    visible: true,
    action: {
      label: 'Try again',
      onClick: () => {},
    },
    autoDismiss: false,
    dismissAfterMs: 5000,
    disableCloseButton: false,
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
    visible: {
      control: { type: 'boolean' },
    },
    action: {
      control: { type: 'object' },
    },
    autoDismiss: {
      control: { type: 'boolean' },
    },
    dismissAfterMs: {
      control: { type: 'number' },
    },
    disableCloseButton: {
      control: { type: 'boolean' },
    },
  },
}

type Story = StoryObj<typeof Snackbar>

export const Content: Story = {
  render: (props) => {
    return (
      <Box
        sx={{
          minHeight: '100px',
        }}
      >
        <Snackbar {...props} />
      </Box>
    )
  },
}

export default meta
