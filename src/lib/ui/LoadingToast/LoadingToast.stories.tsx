import { Box } from '@mui/material'
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { Button } from 'lib/ui/Button.js'
import { LoadingToast } from 'lib/ui/LoadingToast/LoadingToast.js'

const meta: Meta<typeof LoadingToast> = {
  title: 'Library/LoadingToast',
  component: LoadingToast,
  tags: ['autodocs'],
  args: {
    isLoading: true,
    isDoneLoading: false,
  },
  argTypes: {
    isLoading: {
      control: {
        type: 'boolean',
      },
    },
    isDoneLoading: {
      control: {
        type: 'boolean',
      },
    },
  },
}

type Story = StoryObj<typeof LoadingToast>

export const Content: Story = {
  render: (props) => {
    const [, setArgs] = useArgs()
    const reset = (): void => {
      setArgs({ isLoading: true })
      setArgs({ isDoneLoading: false })
    }

    const rerender = (): void => {
      reset()
      setArgs({ isLoading: false })
      setTimeout(() => {
        setArgs({ isLoading: true })
      }, 500)
    }

    const finishLoading = (): void => {
      setArgs({ isDoneLoading: true })
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
          <LoadingToast
            isLoading={props.isLoading}
            isDoneLoading={props.isDoneLoading}
          />
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
