import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import {
  AccessCodeDetails,
  type AccessCodeDetailsProps,
} from 'lib/ui/AccessCodeDetails/AccessCodeDetails.js'
import useToggle from 'lib/use-toggle.js'

/**
 * These stories showcase the device manager.
 */
const meta: Meta<typeof AccessCodeDetails> = {
  title: 'Example/AccessCodeDetails',
  component: AccessCodeDetails,
  tags: ['autodocs'],
  args: {
    accessCode: {
      access_code_id: uuid(),
      type: 'time_bound',
      starts_at: DateTime.now().minus({ days: 2 }).toISO() ?? '',
      ends_at: DateTime.now().plus({ days: 1 }).toISO() ?? '',
      code: '1234',
      created_at: DateTime.now().toISO() ?? '',
      device_id: 'some_device_id',
      status: 'set',
      name: 'Guest - Kranz',
    },
  },
}

export default meta

type Story = StoryObj<typeof AccessCodeDetails>

export const Content: Story = {}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent(props: AccessCodeDetailsProps): JSX.Element {
  const [showing, toggleShowing] = useToggle()
  // Wrap modal/dialog contents in `seam-components` class
  // to apply styles when rendered in a portal,
  // which is the default MUI behavior.
  return (
    <>
      <Button onClick={toggleShowing}>Open Modal</Button>
      <Dialog open={showing} fullWidth maxWidth='sm' onClose={toggleShowing}>
        <div className='seam-components'>
          <AccessCodeDetails {...props} />
        </div>
      </Dialog>
    </>
  )
}
