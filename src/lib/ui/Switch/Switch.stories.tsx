import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'

import Switch from './Switch.js'

const meta: Meta<typeof Switch> = {
  title: 'Library/Switch',
  tags: ['autodocs'],
  component: Switch,
}

type Story = StoryObj<typeof Switch>

export const Content: Story = {
  render: (props) => {
    const [checked, setChecked] = useState(props.checked || false)

    // allows the prop from the story to update the component
    useEffect(() => {
      setChecked(props.checked)
    }, [props.checked])

    return (
      <Switch label={props.label} checked={checked} onChange={setChecked} />
    )
  },
}

Content.args = {
  checked: false,
}

export default meta
