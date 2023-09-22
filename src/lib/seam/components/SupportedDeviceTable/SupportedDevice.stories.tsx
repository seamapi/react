import { Button, Dialog, DialogActions } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { SupportedDeviceTable } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceTable.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase the supported devices table.
 */
const meta: Meta<typeof SupportedDeviceTable> = {
  title: 'Components/SupportedDeviceTable',
  component: SupportedDeviceTable,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6nCfNVHmYQ7wxhnFOpFBm6/Supported-devices?type=design&node-id=171-36651&mode=design&t=JkLcfU9cdo7cMpHR-4',
    },
  },
}

export default meta

type Story = StoryObj<typeof SupportedDeviceTable>

export const Content: Story = {}

export const NoFilter: Story = {
  render: (props) => <SupportedDeviceTable {...props} disableFilter />,
}

export const InsideModal: Story = {
  render: (props) => {
    const [open, toggleOpen] = useToggle()
    return (
      <>
        <Button onClick={toggleOpen}>Open Modal</Button>
        <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
          <SupportedDeviceTable {...props} />

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
