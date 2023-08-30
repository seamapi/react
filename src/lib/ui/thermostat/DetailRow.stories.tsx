import type { Meta, StoryObj } from '@storybook/react'

import { DetailsSection } from 'lib/ui/thermostat/DetailsSection.js'

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
      <DetailsSection title='Section'>
        <DetailRow title='Detail row'>
          <p>Right area content</p>
        </DetailRow>
      </DetailsSection>
    )
  },
}

export default meta
