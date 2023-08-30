import type { Meta, StoryObj } from '@storybook/react'

import { DetailRow } from './DetailRow.js'
import { DetailsSection } from 'lib/ui/thermostat/DetailsSection.js'

const meta: Meta<typeof DetailRow> = {
  title: 'Library/DetailRow',
  tags: ['autodocs'],
  component: DetailRow,
}

type Story = StoryObj<typeof DetailRow>

export const Content: Story = {
  render: () => {
    return (
      <div className='seam-thermostat-details-sections'>
        <DetailsSection title='Section'>
          <DetailRow title='Detail row'></DetailRow>
        </DetailsSection>
      </div>
    )
  },
}

export default meta
