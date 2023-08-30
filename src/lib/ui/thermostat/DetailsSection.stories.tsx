import type { Meta, StoryObj } from '@storybook/react'

import { DetailSection } from 'lib/ui/thermostat/DetailSection.js'
import { DetailRow } from 'lib/ui/thermostat/DetailRow.js'
import { DetailSections } from 'lib/ui/thermostat/DetailSections.js'

const meta: Meta<typeof DetailSection> = {
  title: 'Library/DetailSection',
  tags: ['autodocs'],
  component: DetailSection,
}

type Story = StoryObj<typeof DetailSection>

export const Content: Story = {
  render: () => {
    return (
      <DetailSections>
        <DetailSection title='Section'>
          <DetailRow title='Detail row 1' />
          <DetailRow title='Detail row 2' />
        </DetailSection>

        <DetailSection
          title='Section (with tooltip)'
          tooltipContent="Hey, I'm a tooltip!"
        >
          <DetailRow title='Detail row 1' />
          <DetailRow title='Detail row 2' />
        </DetailSection>
      </DetailSections>
    )
  },
}

export default meta
