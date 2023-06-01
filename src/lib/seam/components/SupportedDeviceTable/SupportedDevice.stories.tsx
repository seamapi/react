import { Button, Dialog, DialogActions } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { SupportedDeviceTable } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceTable.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase the supported devices table.
 */
const meta: Meta<typeof SupportedDeviceTable> = {
  title: 'Example/SupportedDeviceTable',
  component: SupportedDeviceTable,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SupportedDeviceTable>

export const Content: Story = {}

export const NoFilter: Story = {
  render: (props) => <SupportedDeviceTable {...props} cannotFilter />,
}

export const InsideModal: Story = {
  render: (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, toggleOpen] = useToggle()
    return (
      <>
        <Button onClick={toggleOpen}>Open Modal</Button>
        <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
          <div className='seam-components'>
            <SupportedDeviceTable {...props} />
          </div>

          <DialogActions
            sx={{ justifyContent: 'center', marginBottom: '16px' }}
          >
            <Button variant='outlined' onClick={toggleOpen}>
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  },
}
