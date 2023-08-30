import type { Meta, StoryObj } from '@storybook/react'

import { AccordionRow } from './AccordionRow.js'
import { DetailSection } from './DetailSection.js'

const meta: Meta<typeof AccordionRow> = {
  title: 'Library/AccordionRow',
  tags: ['autodocs'],
  component: AccordionRow,
}

type Story = StoryObj<typeof AccordionRow>

export const Content: Story = {
  render: () => {
    return (
      <DetailSection label='Section'>
        <AccordionRow
          label='Accordion row'
          rightCollapsedContent={<p>Right area content</p>}
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            aliquam, nisl quis tincidunt aliquet, diam nunc aliquam nunc, nec
            aliquam diam nunc eget nisl. Donec euismod, nisl eget aliquam
            aliquam, nisl nisl aliquam diam, nec aliquam diam nunc eget nisl.
          </p>
        </AccordionRow>
      </DetailSection>
    )
  },
}

export default meta
