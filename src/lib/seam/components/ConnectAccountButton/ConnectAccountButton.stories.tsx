import type { Meta, StoryObj } from '@storybook/react'

import { ConnectAccountButton } from 'lib/seam/components/ConnectAccountButton/ConnectAccountButton.js'

const meta: Meta<typeof ConnectAccountButton> = {
  title: 'Example/ConnectAccountButton',
  component: ConnectAccountButton,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ConnectAccountButton>

export const Content: Story = {}
