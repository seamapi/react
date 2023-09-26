import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Button } from 'lib/ui/Button.js'
import { LoadingToast } from 'lib/ui/LoadingToast/LoadingToast.js'

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
    const [isLoading, setIsLoading] = useState(true)
    const [isDoneLoading, setIsDoneLoading] = useState(false)

    const reset = () => {
      setIsLoading(true)
      setIsDoneLoading(false)
    }

    const rerender = () => {
      reset()
      setIsLoading(false)
      setTimeout(() => { setIsLoading(true); }, 500)
    }

    const finishLoading = () => {
      setIsDoneLoading(true)
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1rem',
        }}
      >
        <Box height={32}>
          <LoadingToast isLoading={isLoading} isDoneLoading={isDoneLoading} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <Button size='small' onClick={rerender}>
            Rerender
          </Button>

          <Button size='small' onClick={finishLoading}>
            Finish loading
          </Button>
        </Box>
      </Box>
    )
  },
}

export default meta
