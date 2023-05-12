import { Button, Dialog, DialogActions } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import NavigationProvider from 'lib/NavigationProvider.js'
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

function InsideModalComponent({ onBack, ...otherProps }: DeviceTableProps) {
  const [open, toggleOpen] = useToggle()
  // Wrap modal/dialog contents in `seam-components` class
  // to apply styles when rendered in a portal,
  // which is the default MUI behavior.
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

export const WithNavigation: Story = {
  render: WithNavigationComponent,
}

function WithNavigationComponent(props: DeviceTableProps) {
  const [open, toggleOpen] = useToggle()
  // Wrap modal/dialog contents in `seam-components` class
  // to apply styles when rendered in a portal,
  // which is the default MUI behavior.
  return (
    <>
      <Button onClick={toggleOpen}>Open Modal</Button>
      <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
        <div className='seam-components'>
          <NavigationProvider>
            <DeviceTable {...props} />
          </NavigationProvider>
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
