import { Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import type { LockDevice } from 'seamapi'
import { v4 as uuidv4 } from 'uuid'

import { DeviceDetails } from 'lib/ui/DeviceDetails/DeviceDetails.js'

const fakeDevice: LockDevice = {
  workspace_id: uuidv4(),
  device_id: uuidv4(),
  connected_account_id: uuidv4(),
  device_type: 'august_lock',
  created_at: '2022-12-18T04:35:20.737Z',
  properties: {
    name: 'Room 101 Front Door',
    battery_level: 0.9,
    locked: true,
    online: false,
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
}

export default meta

type Story = StoryObj<typeof DeviceDetails>

export const Default: Story = {}

export const InsideModal: Story = {
  render: (props) => {
    return (
      <Dialog open fullWidth maxWidth='sm'>
        <div className='seam-components'>
          <DeviceDetails {...props} />
        </div>
      </Dialog>
    )
  },
}
