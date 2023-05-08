import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'

import { AccessCodeTable } from 'lib/ui/AccessCodeTable/AccessCodeTable.js'
import useToggle from 'lib/use-toggle.js'

/**
 * These stories showcase the device manager.
 */
const meta: Meta<typeof AccessCodeTable> = {
  title: 'Example/AccessCodeTable',
  component: AccessCodeTable,
  tags: ['autodocs'],
  args: {
    deviceId: 'device1',
  },
}

export default meta

type Story = StoryObj<typeof AccessCodeTable>

export const Content: Story = {}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent(props: ComponentProps<typeof AccessCodeTable>) {
  const [showing, toggleShowing] = useToggle()
  // Wrap modal/dialog contents in `seam-components` class
  // to apply styles when rendered in a portal,
  // which is the default MUI behavior.
  return (
    <>
      <Button onClick={toggleShowing}>Show Modal</Button>
      <Dialog open={showing} fullWidth maxWidth='sm' onClose={toggleShowing}>
        <div className='seam-components'>
          <AccessCodeTable {...props} />
        </div>
      </Dialog>
    </>
  )
}
