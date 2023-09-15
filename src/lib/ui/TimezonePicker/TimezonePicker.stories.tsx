import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { getBrowserTimezone } from 'lib/dates.js'
import { TimezonePicker } from 'lib/ui/TimezonePicker/TimezonePicker.js'

const meta: Meta<typeof TimezonePicker> = {
  title: 'Library/TimezonePicker',
  tags: ['autodocs'],
  component: TimezonePicker,
}

type Story = StoryObj<typeof TimezonePicker>

export const Content: Story = {
  render: (props) => {
    const [, setArgs] = useArgs()

    const onChange = (timezone: string): void => {
      setArgs({ value: timezone })
    }

    return <TimezonePicker value={props.value} onChange={onChange} />
  },
}

Content.args = {
  value: getBrowserTimezone(),
}

export default meta
