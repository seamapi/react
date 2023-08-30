import type { Meta, StoryObj } from '@storybook/react'

import { DetailsSection } from 'lib/ui/thermostat/DetailsSection.js'

import { DetailSections } from './DetailSections.js'
import { DetailRow } from 'lib/ui/thermostat/DetailRow.js'

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
          <DetailRow title='Row 1'></DetailRow>
          <DetailRow title='Row 2'></DetailRow>
          <DetailRow title='Row 3'></DetailRow>
        </DetailsSection>

        <DetailsSection title='Section 2'>
          <DetailRow title='Row 1'></DetailRow>
          <DetailRow title='Row 2'></DetailRow>
          <DetailRow title='Row 3'></DetailRow>
        </DetailsSection>

        <DetailsSection title='Section 3'>
          <DetailRow title='Row 1'></DetailRow>
          <DetailRow title='Row 2'></DetailRow>
          <DetailRow title='Row 3'></DetailRow>
        </DetailsSection>
      </DetailSections>
    )
  },
}

export default meta
