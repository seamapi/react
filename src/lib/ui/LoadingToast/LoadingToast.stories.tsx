import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from 'lib/ui/Button.js'

import { LoadingToast } from 'lib/ui/LoadingToast/LoadingToast.js'
import { useState } from 'react'

const meta: Meta<typeof LoadingToast> = {
  title: 'Library/LoadingToast',
  component: LoadingToast,
  args: {},
  tags: ['autodocs'],
  argTypes: {},
}

type Story = StoryObj<typeof LoadingToast>

export const Content: Story = {
  render: () => {
    const [shouldRender, setShouldRender] = useState(true)

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1rem',
        }}
      >
        <Box height={32}>{shouldRender && <LoadingToast />}</Box>

        <Button
          size='small'
          onClick={() => {
            setShouldRender(false)
            setTimeout(() => setShouldRender(true), 500)
          }}
        >
          Animate
        </Button>
      </Box>
    )
  },
}

export default meta
