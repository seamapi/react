import { Button, Dialog, DialogActions } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import type { LockDevice } from 'seamapi'
import { v4 as uuid } from 'uuid'

import {
  DeviceTable,
  type DeviceTableProps,
} from 'lib/ui/DeviceTable/DeviceTable.js'
import useToggle from 'lib/use-toggle.js'

const devices: LockDevice[] = [
  {
    workspace_id: uuid(),
    device_id: uuid(),
    connected_account_id: uuid(),
    device_type: 'schlage_lock',
    created_at: '2022-12-18T04:35:20.737Z',
    properties: {
      name: 'Room 101 Front Door',
      battery_level: 0.2,
      locked: false,
      online: true,
      schlage_metadata: {
        model: 'Schlage Lock',
        device_id: uuid(),
        device_name: 'Lock',
        access_code_length: 6,
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/schlage_sense-smart-deadbolt-with-camelot-trim_front.png',
    },
    errors: [],
    warnings: [],
    capabilities_supported: [],
  },
  {
    workspace_id: uuid(),
    device_id: uuid(),
    connected_account_id: uuid(),
    device_type: 'august_lock',
    created_at: '2022-12-24T04:35:20.737Z',
    properties: {
      name: 'Gym',
      battery_level: 0.2,
      locked: true,
      online: false,
      august_metadata: {
        lock_id: 'lock-3',
        lock_name: 'GARAGE',
        model: 'Wifi Smartlock',
        has_keypad: true,
        house_name: 'My House',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/august_wifi-smart-lock-3rd-gen_silver_front.png',
    },
    errors: [],
    warnings: [],
    capabilities_supported: [],
  },
  {
    workspace_id: uuid(),
    device_id: uuid(),
    connected_account_id: uuid(),
    device_type: 'august_lock',
    created_at: '2022-12-24T04:35:20.737Z',
    properties: {
      name: 'Apartment 25D',
      battery_level: 1,
      locked: true,
      online: true,
      august_metadata: {
        lock_id: 'lock-3',
        lock_name: 'GARAGE',
        has_keypad: true,
        house_name: 'My House',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/nuki_smart_lock_3_pro_black.png',
    },
    errors: [],
    warnings: [],
    capabilities_supported: [],
  },
  {
    workspace_id: uuid(),
    device_id: uuid(),
    connected_account_id: uuid(),
    device_type: 'august_lock',
    created_at: '2022-12-24T04:35:20.737Z',
    properties: {
      name: 'Apartment 26A',
      battery_level: 0.4,
      locked: false,
      online: false,
      august_metadata: {
        lock_id: 'lock-3',
        lock_name: 'GARAGE',
        model: 'Smart Lock 3',
        has_keypad: true,
        house_name: 'My House',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/nuki_smart_lock_3_pro_black.png',
    },
    errors: [],
    warnings: [],
    capabilities_supported: [],
  },
]

const meta: Meta<typeof DeviceTable> = {
  title: 'Example/DeviceTable',
  component: DeviceTable,
  tags: ['autodocs'],
  args: {
    devices,
  },
}

export default meta

type Story = StoryObj<typeof DeviceTable>

export const Content: Story = {}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent(props: DeviceTableProps) {
  const [showing, toggleShowing] = useToggle()
  // Wrap modal/dialog contents in `seam-components` class
  // to apply styles when rendered in a portal,
  // which is the default MUI behavior.
  return (
    <>
      <Button onClick={toggleShowing}>Open Modal</Button>
      <Dialog open={showing} fullWidth maxWidth='sm' onClose={toggleShowing}>
        <div className='seam-components'>
          <DeviceTable {...props} />
        </div>
        <DialogActions
          sx={{
            justifyContent: 'center',
          }}
        >
          <Button onClick={toggleShowing}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
