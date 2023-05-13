import { Button, Dialog, DialogActions } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import {
  DeviceTable,
  type DeviceTableProps,
} from 'lib/ui/DeviceTable/DeviceTable.js'
import useToggle from 'lib/use-toggle.js'

const meta: Meta<typeof DeviceTable> = {
  title: 'Example/DeviceTable',
  component: DeviceTable,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DeviceTable>

export const Content: Story = {
  render: ({ onBack, ...otherProps }) => <DeviceTable {...otherProps} />,
}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent({
  onBack,
  ...otherProps
}: DeviceTableProps): JSX.Element {
  const [open, toggleOpen] = useToggle()
  return (
    <>
      <Button onClick={toggleOpen}>Open Modal</Button>
      <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
        <div className='seam-components'>
          <DeviceTable {...otherProps} />
        </div>
        <DialogActions
          sx={{
            justifyContent: 'center',
          }}
        >
          <Button onClick={toggleOpen}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
