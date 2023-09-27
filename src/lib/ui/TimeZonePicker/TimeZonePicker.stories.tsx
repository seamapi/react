import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { getSystemTimeZone } from 'lib/dates.js'
import { TimeZonePicker } from 'lib/ui/TimeZonePicker/TimeZonePicker.js'

const meta: Meta<typeof TimeZonePicker> = {
  title: 'Library/TimeZonePicker',
  tags: ['autodocs'],
  component: TimeZonePicker,
}

type Story = StoryObj<typeof TimeZonePicker>

export const Content: Story = {
  render: (props) => {
    const [, setArgs] = useArgs()

    const onChange = (timeZone: string): void => {
      setArgs({ value: timeZone })
    }

    return <TimeZonePicker value={props.value} onChange={onChange} />
  },
}

Content.args = {
  value: getSystemTimeZone(),
}

export default meta
