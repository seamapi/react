import { Close as CloseIcon } from '@mui/icons-material'
import { Button, Dialog, DialogActions, IconButton } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import type { LockDevice } from 'seamapi'

import {
  DeviceDetails,
  type DeviceDetailsProps,
} from 'lib/ui/DeviceDetails/DeviceDetails.js'
import useToggle from 'lib/use-toggle.js'

const fakeDevice: LockDevice = {
  workspace_id: '0f272652-7bdd-4abc-9fb0-616f25c2213e',
  device_id: 'fc4eef92-951f-4954-8358-742ca90516e0',
  connected_account_id: '4de4e249-17c2-4bbc-8828-08aaac6fd098',
  device_type: 'august_lock',
  created_at: '2022-12-18T04:35:20.737Z',
  properties: {
    name: 'Room 101 Front Door',
    battery_level: 0.2,
    locked: true,
    online: true,
    schlage_metadata: {
      model: 'Schlage Lock',
      device_id: '95b0c8fd-ab40-4dcb-9f73-3c20f89cea19',
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
