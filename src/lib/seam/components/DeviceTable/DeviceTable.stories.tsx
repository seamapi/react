import { Button, Dialog, DialogActions } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import {
  DeviceTable,
  type DeviceTableProps,
} from 'lib/seam/components/DeviceTable/DeviceTable.js'
import { seamComponentsClassName } from 'lib/seam/SeamProvider.js'
import { useToggle } from 'lib/ui/use-toggle.js'

const meta: Meta<typeof DeviceTable> = {
  title: 'Components/DeviceTable',
  component: DeviceTable,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Su3VO6yupz4yxe88fv0Uqa/Seam-Components?type=design&node-id=358-43308&mode=design&t=4OQwfRB8Mw8kT1rw-4',
    },
  },
}

export default meta

type Story = StoryObj<typeof DeviceTable>

export const Content: Story = {
  render: ({ onBack, ...props } = {}) => <DeviceTable {...props} />,
}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent({
  onBack,
  ...props
}: DeviceTableProps = {}): JSX.Element {
  const [open, toggleOpen] = useToggle()
  return (
    <>
      <Button onClick={toggleOpen}>Open Modal</Button>
      <Dialog
        className={seamComponentsClassName}
        open={open}
        fullWidth
        maxWidth='sm'
        onClose={toggleOpen}
      >
        <DeviceTable {...props} />
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

export const ReadOnlyCustomerSupportPanel: Story = {
  render: ({ onBack, ...props } = {}) => (
    <DeviceTable
      {...props}
      connectedAccountIds={['connected_account1']}
      disableLockUnlock
    />
  ),
}
