import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import {
  AccessCodeTable,
  type AccessCodeTableProps,
} from 'lib/ui/AccessCodeTable/AccessCodeTable.js'
import useToggle from 'lib/use-toggle.js'

/**
 * These stories showcase the access code table.
 */
const meta: Meta<typeof AccessCodeTable> = {
  title: 'Example/AccessCodeTable',
  component: AccessCodeTable,
  tags: ['autodocs'],
  args: {
    deviceId: 'f9a9ab36-9e14-4390-a88c-b4c78304c6aa',
  },
}

export default meta

type Story = StoryObj<typeof AccessCodeTable>

export const Content: Story = {}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent(props: AccessCodeTableProps): JSX.Element {
  const [open, toggleOpen] = useToggle()
  return (
    <>
      <Button onClick={toggleOpen}>Open Modal</Button>
      <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
        <div className='seam-components'>
          <AccessCodeTable {...props} />
        </div>
      </Dialog>
    </>
  )
}
