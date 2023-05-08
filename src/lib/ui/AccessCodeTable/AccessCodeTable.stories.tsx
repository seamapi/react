import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { DateTime } from 'luxon'
import type { AccessCode } from 'seamapi'
import { v4 as uuid } from 'uuid'

import {
  AccessCodeTable,
  type AccessCodeTableProps,
} from 'lib/ui/AccessCodeTable/AccessCodeTable.js'
import useToggle from 'lib/use-toggle.js'

const accessCodes: AccessCode[] = [
  {
    access_code_id: uuid(),
    type: 'time_bound',
    code: '1234',
    created_at: Date.now().toString(),
    device_id: 'some_device_id',
    status: 'set',
    name: 'Guest - Gonzalez',
    starts_at: DateTime.now().minus({ day: 2 }).toISO() ?? '',
    ends_at: DateTime.now().plus({ day: 2 }).toISO() ?? '',
  },
  {
    access_code_id: uuid(),
    type: 'time_bound',
    code: '1234',
    created_at: DateTime.now().toISO() ?? '',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Guest - Thompson',
    starts_at: DateTime.now().plus({ day: 1 }).toISO() ?? '',
    ends_at: DateTime.now().plus({ day: 3 }).toISO() ?? '',
  },
  {
    access_code_id: uuid(),
    type: 'ongoing',
    code: '1234',
    created_at: DateTime.now().toISO() ?? '',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Guest - Kranz',
  },
  {
    access_code_id: uuid(),
    type: 'ongoing',
    code: '1234',
    created_at: DateTime.now().toISO() ?? '',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Sparkle Cleaners',
  },
  {
    access_code_id: uuid(),
    type: 'ongoing',
    code: '1234',
    created_at: DateTime.now().toISO() ?? '',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Guest - yang',
  },
  {
    access_code_id: uuid(),
    type: 'ongoing',
    code: '1234',
    created_at: DateTime.now().toISO() ?? '',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Astro Plumbing',
  },
]

/**
 * These stories showcase the device manager.
 */
const meta: Meta<typeof AccessCodeTable> = {
  title: 'Example/AccessCodeTable',
  component: AccessCodeTable,
  tags: ['autodocs'],
  args: {
    accessCodes,
  },
}

export default meta

type Story = StoryObj<typeof AccessCodeTable>

export const Content: Story = {}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent(props: AccessCodeTableProps) {
  const [showing, toggleShowing] = useToggle()
  // Wrap modal/dialog contents in `seam-components` class
  // to apply styles when rendered in a portal,
  // which is the default MUI behavior.
  return (
    <>
      <Button onClick={toggleShowing}>Show Modal</Button>
      <Dialog open={showing} fullWidth maxWidth='sm' onClose={toggleShowing}>
        <div className='seam-components'>
          <AccessCodeTable {...props} />
        </div>
      </Dialog>
    </>
  )
}
