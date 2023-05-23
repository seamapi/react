import { Button, Dialog, DialogActions } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import useToggle from 'lib/use-toggle.js'

import { SupportedDevices } from './SupportedDevices.js'

/**
 * These stories showcase the supported devices table.
 */
const meta: Meta<typeof SupportedDevices> = {
  title: 'Example/SupportedDevices',
  component: SupportedDevices,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SupportedDevices>

export const Content: Story = {
  render: (props: any) => <SupportedDevices {...props} />,
}

export const InsideModal: Story = {
  render: (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, toggleOpen] = useToggle()
    return (
      <>
        <Button onClick={toggleOpen}>Open Modal</Button>
        <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
          <div className='seam-components'>
            <SupportedDevices {...props} />
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
