import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import Switch from './Switch.js'

const meta: Meta<typeof Switch> = {
  title: 'Library/Switch',
  tags: ['autodocs'],
  component: Switch,
}

type Story = StoryObj<typeof Switch>

export const Content: Story = {
  render: (props) => {
    const [, setArgs] = useArgs()

    const onChange = (checked: boolean): void => {
      setArgs({ checked })
    }

    return (
      <Switch
        enableLabel={props.enableLabel}
        checked={props.checked}
        onChange={onChange}
      />
    )
  },
}

Content.args = {
  checked: false,
}

export default meta
