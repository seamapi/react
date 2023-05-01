import { Container as MuiContainer, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { AccessCodeTable } from 'lib/ui/AccessCodeTable/AccessCodeTable.js'

/**
 * These stories showcase the device manager.
 */
const meta: Meta<typeof AccessCodeTable> = {
  title: 'Example/AccessCodeTable',
  component: AccessCodeTable,
  args: {
    accessCodes: [
      {
        access_code_id: 'someeid',
        type: 'ongoing',
        code: '1234',
        created_at: Date.now().toString(),
        device_id: 'some_device_id',
        status: 'set',
        name: 'Guest - Gonzalez',
      },
      {
        access_code_id: 'someeid',
        type: 'ongoing',
        code: '1234',
        created_at: Date.now().toString(),
        device_id: 'some_device_id',
        status: 'set',
        name: 'Guest - Thompson',
      },
      {
        access_code_id: 'someeid',
        type: 'ongoing',
        code: '1234',
        created_at: Date.now().toString(),
        device_id: 'some_device_id',
        status: 'set',
        name: 'Guest - Kranz',
      },
      {
        access_code_id: 'someeid',
        type: 'ongoing',
        code: '1234',
        created_at: Date.now().toString(),
        device_id: 'some_device_id',
        status: 'set',
        name: 'Sparkle Cleaners',
      },
      {
        access_code_id: 'someeid',
        type: 'ongoing',
        code: '1234',
        created_at: Date.now().toString(),
        device_id: 'some_device_id',
        status: 'set',
        name: 'Guest - yang',
      },
      {
        access_code_id: 'someeid',
        type: 'ongoing',
        code: '1234',
        created_at: Date.now().toString(),
        device_id: 'some_device_id',
        status: 'set',
        name: 'Astro Plumbing',
      },
    ],
  },
}

export default meta

type Story = StoryObj<typeof AccessCodeTable>

export const Default: Story = {}

export const Container: Story = {
  render: (props) => {
    return (
      <MuiContainer maxWidth='sm'>
        <AccessCodeTable {...props} />
      </MuiContainer>
    )
  },
}

export const InsideModal: Story = {
  render: (props) => {
    return (
      <Dialog open fullWidth maxWidth='sm'>
        <div className='seam-css'>
          <AccessCodeTable {...props} />
        </div>
      </Dialog>
    )
  },
}
