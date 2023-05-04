import { Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { AccessCodeTable } from 'lib/ui/AccessCodeTable/AccessCodeTable.js'

/**
 * These stories showcase the device manager.
 */
const meta: Meta<typeof AccessCodeTable> = {
  title: 'Example/AccessCodeTable',
  component: AccessCodeTable,
  args: {
    deviceId: 'device1',
  },
}

export default meta

type Story = StoryObj<typeof AccessCodeTable>

export const Content: Story = {}

export const InsideModal: Story = {
  render: (props) => {
    // Wrap modal/dialog contents in `seam-components` class
    // to apply styles when rendered in a portal,
    // which is the the default MUI behavio.
    return (
      <Dialog open fullWidth maxWidth='sm'>
        <div className='seam-components'>
          <AccessCodeTable {...props} />
        </div>
      </Dialog>
    )
  },
}
