import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

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
      access_code_id: 'abf0367a-d44c-4aa3-b235-dc0dbac174b7',
      type: 'time_bound',
      starts_at: '2023-05-18T01:05:45Z',
      ends_at: '2023-05-20T01:03:45Z',
      code: '1234',
      created_at: '2023-05-13T01:05:45Z',
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
  const [open, toggleOpen] = useToggle()
  // Wrap modal/dialog contents in `seam-components` class
  // to apply styles when rendered in a portal,
  // which is the default MUI behavior.
  return (
    <>
      <Button onClick={toggleOpen}>Open Modal</Button>
      <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
        <div className='seam-components'>
          <AccessCodeDetails {...props} />
        </div>
      </Dialog>
    </>
  )
}
