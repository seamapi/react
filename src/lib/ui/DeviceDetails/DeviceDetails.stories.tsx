import { Close as CloseIcon } from '@mui/icons-material'
import { Button, Dialog, DialogActions, IconButton } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import type { LockDevice } from 'seamapi'
import { v4 as uuid } from 'uuid'

import {
  DeviceDetails,
  type DeviceDetailsProps,
} from 'lib/ui/DeviceDetails/DeviceDetails.js'
import useToggle from 'lib/use-toggle.js'

const fakeDevice: LockDevice = {
  workspace_id: uuid(),
  device_id: uuid(),
  connected_account_id: uuid(),
  device_type: 'august_lock',
  created_at: '2022-12-18T04:35:20.737Z',
  properties: {
    name: 'Room 101 Front Door',
    battery_level: 0.2,
    locked: true,
    online: true,
    schlage_metadata: {
      model: 'Schlage Lock',
      device_id: uuid(),
      device_name: 'Lock',
      access_code_length: 6,
    },
  },
  errors: [],
  warnings: [],
  capabilities_supported: [],
}

/**
 * These stories showcase the device manager.
 */
const meta: Meta<typeof DeviceDetails> = {
  title: 'Example/DeviceDetails',
  component: DeviceDetails,
  args: {
    device: fakeDevice,
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DeviceDetails>

export const Content: Story = {}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent(props: DeviceDetailsProps) {
  const [showing, toggleShowing] = useToggle()
  // Wrap modal/dialog contents in `seam-components` class
  // to apply styles when rendered in a portal,
  // which is the default MUI behavior.
  return (
    <>
      <Button onClick={toggleShowing}>Open Modal</Button>
      <Dialog open={showing} fullWidth maxWidth='sm' onClose={toggleShowing}>
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
