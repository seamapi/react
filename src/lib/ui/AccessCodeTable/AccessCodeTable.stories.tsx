import type { Meta, StoryObj } from '@storybook/react'

import AccessCodeTable from 'lib/ui/AccessCodeTable/index.js'

/**
 * These stories showcase the device manager.
 */
const meta: Meta<typeof AccessCodeTable> = {
  title: 'Example/AccessCodeTable',
  component: AccessCodeTable,
}

export default meta

type Story = StoryObj<typeof AccessCodeTable>

export const Default: Story = {}

export const InsideModal: Story = {}

export const BodyOnly: Story = {}
