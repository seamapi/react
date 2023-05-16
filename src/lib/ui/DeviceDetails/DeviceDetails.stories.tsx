import { Close as CloseIcon } from '@mui/icons-material'
import { Button, Dialog, DialogActions, IconButton } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import {
  DeviceDetails,
  type DeviceDetailsProps,
} from 'lib/ui/DeviceDetails/DeviceDetails.js'
import useToggle from 'lib/use-toggle.js'

/**
 * These stories showcase the device details.
 */
const meta: Meta<typeof DeviceDetails> = {
  title: 'Example/DeviceDetails',
  component: DeviceDetails,
  args: {
    deviceId: '6c874099-0a92-4eb1-92a5-993db45efffc',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DeviceDetails>

export const Content: Story = {}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent(props: DeviceDetailsProps): JSX.Element {
  const [open, toggleOpen] = useToggle()
  return (
    <>
      <Button onClick={toggleOpen}>Open Modal</Button>
      <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
        <IconButton
          sx={{
            position: 'absolute',
            top: '4px',
            right: '8px',
          }}
        >
          <CloseIcon />
        </IconButton>
        <div className='seam-components'>
          <DeviceDetails {...props} />
        </div>
        <DialogActions sx={{ justifyContent: 'center', marginBottom: '16px' }}>
          <Button variant='outlined'>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
