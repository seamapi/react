import type { Meta, StoryObj } from '@storybook/react'

import Switch from './Switch.js'

const meta: Meta<typeof Switch> = {
  title: 'Library/Switch',
  tags: ['autodocs'],
  component: Switch,
}

type Story = StoryObj<typeof Switch>

export const Content: Story = {
  render: (props) => <Switch {...props} />,
}

export default meta
