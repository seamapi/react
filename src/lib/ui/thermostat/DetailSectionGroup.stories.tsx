import type { Meta, StoryObj } from '@storybook/react'

import { DetailRow } from 'lib/ui/thermostat/DetailRow.js'
import { DetailSection } from 'lib/ui/thermostat/DetailSection.js'

import { DetailSectionGroup } from './DetailSectionGroup.js'

const meta: Meta<typeof DetailSectionGroup> = {
  title: 'Library/DetailSectionGroup',
  tags: ['autodocs'],
  component: DetailSectionGroup,
}

type Story = StoryObj<typeof DetailSectionGroup>

export const Content: Story = {
  render: () => {
    return (
      <DetailSectionGroup>
        <DetailSection title='Section 1'>
          <DetailRow title='Row 1' />
          <DetailRow title='Row 2' />
          <DetailRow title='Row 3' />
        </DetailSection>

        <DetailSection title='Section 2'>
          <DetailRow title='Row 1' />
          <DetailRow title='Row 2' />
          <DetailRow title='Row 3' />
        </DetailSection>

        <DetailSection title='Section 3'>
          <DetailRow title='Row 1' />
          <DetailRow title='Row 2' />
          <DetailRow title='Row 3' />
        </DetailSection>
      </DetailSectionGroup>
    )
  },
}

export default meta
