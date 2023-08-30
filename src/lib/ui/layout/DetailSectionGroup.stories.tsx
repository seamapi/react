import type { Meta, StoryObj } from '@storybook/react'

import { DetailRow } from './DetailRow.js'
import { DetailSection } from './DetailSection.js'

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
        <DetailSection label='Section 1'>
          <DetailRow label='Row 1' />
          <DetailRow label='Row 2' />
          <DetailRow label='Row 3' />
        </DetailSection>

        <DetailSection label='Section 2'>
          <DetailRow label='Row 1' />
          <DetailRow label='Row 2' />
          <DetailRow label='Row 3' />
        </DetailSection>

        <DetailSection label='Section 3'>
          <DetailRow label='Row 1' />
          <DetailRow label='Row 2' />
          <DetailRow label='Row 3' />
        </DetailSection>
      </DetailSectionGroup>
    )
  },
}

export default meta
