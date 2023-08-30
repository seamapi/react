import type { Meta, StoryObj } from '@storybook/react'

import { DetailsSection } from 'lib/ui/thermostat/DetailsSection.js'

import { AccordionRow } from './AccordionRow.js'

const meta: Meta<typeof AccordionRow> = {
  title: 'Library/AccordionRow',
  tags: ['autodocs'],
  component: AccordionRow,
}

type Story = StoryObj<typeof AccordionRow>

export const Content: Story = {
  render: () => {
    return (
      <div className='seam-thermostat-details-sections'>
        <DetailsSection title='Section'>
          <AccordionRow title='Accordion row'>
            <p>The content of the accordion row.</p>
          </AccordionRow>
        </DetailsSection>
      </div>
    )
  },
}

export default meta
