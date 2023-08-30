import type { Meta, StoryObj } from '@storybook/react'

import { DetailsSection } from './DetailsSection.js'
import { DetailRow } from 'lib/ui/thermostat/DetailRow.js'

const meta: Meta<typeof DetailsSection> = {
  title: 'Library/DetailsSection',
  tags: ['autodocs'],
  component: DetailsSection,
}

type Story = StoryObj<typeof DetailsSection>

export const Content: Story = {
  render: () => {
    return (
      <div className='seam-thermostat-details-sections'>
        <DetailsSection title='Detail section'>
          <DetailRow title="Detail row">

          </DetailRow>
        </DetailsSection>
      </div>
    )
  },
}

export default meta
