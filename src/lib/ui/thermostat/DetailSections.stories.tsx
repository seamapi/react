import type { Meta, StoryObj } from '@storybook/react'

import { DetailRow } from 'lib/ui/thermostat/DetailRow.js'
import { DetailsSection } from 'lib/ui/thermostat/DetailsSection.js'

import { DetailSections } from './DetailSections.js'

const meta: Meta<typeof DetailSections> = {
  title: 'Library/DetailSections',
  tags: ['autodocs'],
  component: DetailSections,
}

type Story = StoryObj<typeof DetailSections>

export const Content: Story = {
  render: () => {
    return (
      <DetailSections>
        <DetailsSection title='Section 1'>
          <DetailRow title='Row 1' />
          <DetailRow title='Row 2' />
          <DetailRow title='Row 3' />
        </DetailsSection>

        <DetailsSection title='Section 2'>
          <DetailRow title='Row 1' />
          <DetailRow title='Row 2' />
          <DetailRow title='Row 3' />
        </DetailsSection>

        <DetailsSection title='Section 3'>
          <DetailRow title='Row 1' />
          <DetailRow title='Row 2' />
          <DetailRow title='Row 3' />
        </DetailsSection>
      </DetailSections>
    )
  },
}

export default meta
