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
      <DetailsSection title='Section'>
        <AccordionRow
          title='Accordion row'
          triggerRightContent={<p>Right area content</p>}
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            aliquam, nisl quis tincidunt aliquet, diam nunc aliquam nunc, nec
            aliquam diam nunc eget nisl. Donec euismod, nisl eget aliquam
            aliquam, nisl nisl aliquam diam, nec aliquam diam nunc eget nisl.
          </p>
        </AccordionRow>
      </DetailsSection>
    )
  },
}

export default meta
