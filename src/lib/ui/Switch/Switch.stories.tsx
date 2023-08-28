import type { Meta, StoryObj } from '@storybook/react'
import Switch from './Switch.js'

const meta: Meta<typeof Switch> = {
  title: 'Library/Switch',
  tags: ['autodocs'],
  component: Switch,
}

type Story = StoryObj<typeof Switch>

export const Content: Story = {
  render: ({ label, defaultChecked }) => {
    return <Switch label={label} defaultChecked={defaultChecked} />
  },
  args: {
    label: true,
    defaultChecked: false,
  },
}

export default meta
