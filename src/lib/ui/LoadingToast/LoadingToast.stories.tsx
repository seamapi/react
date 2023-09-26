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
  },
  argTypes: {
    isLoading: {
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

    const rerender = (): void => {
      setArgs({ isLoading: false })

      setTimeout(() => {
        setArgs({ isLoading: true })
      }, 2000)
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
          <LoadingToast isLoading={props.isLoading} />
        </Box>

        <Button size='small' onClick={rerender}>
          Rerender
        </Button>
      </Box>
    )
  },
}

export default meta
