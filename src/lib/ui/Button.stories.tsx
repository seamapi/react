import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { Button } from 'lib/ui/Button.js'

const meta: Meta<typeof Button> = {
  title: 'Library/Button',
  component: Button,
  args: {
    children: 'Label',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      table: {
        disable: true,
      },
    },
    size: {
      table: {
        disable: true,
      },
    },
  },
}

type Story = StoryObj<typeof Button>

export const Content: Story = {
  render: (props) => {
    return (
      <Box display='grid' gap={3} gridTemplateColumns='repeat(3, min-content)'>
        <div>
          <Button {...props} variant='outline' size='small' />
        </div>
        <div>
          <Button {...props} variant='outline' size='medium' />
        </div>
        <div>
          <Button {...props} variant='outline' size='large' />
        </div>
        <div>
          <Button {...props} variant='solid' size='small' />
        </div>
        <div>
          <Button {...props} variant='solid' size='medium' />
        </div>
        <div>
          <Button {...props} variant='solid' size='large' />
        </div>
        <div>
          <Button {...props} variant='neutral' size='small' />
        </div>
        <div>
          <Button {...props} variant='neutral' size='medium' />
        </div>
        <div>
          <Button {...props} variant='neutral' size='large' />
        </div>
      </Box>
    )
  },
}

export default meta
