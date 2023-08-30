import type { Meta, StoryObj } from '@storybook/react'

import { DetailSection } from 'lib/ui/thermostat/DetailSection.js'

import { DetailRow } from './DetailRow.js'

const meta: Meta<typeof DetailRow> = {
  title: 'Library/DetailRow',
  tags: ['autodocs'],
  component: DetailRow,
}

type Story = StoryObj<typeof DetailRow>

export const Content: Story = {
  render: () => {
    return (
      <DetailSection label='Section'>
        <DetailRow label='Detail row'>
          <p>Right area content</p>
        </DetailRow>
      </DetailSection>
    )
  },
}

export default meta
