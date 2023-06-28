import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { AccessCodeTable } from 'lib/seam/components/AccessCodeTable/AccessCodeTable.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase the access code table.
 */
const meta: Meta<typeof AccessCodeTable> = {
  title: 'Example/AccessCodeTable',
  component: AccessCodeTable,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AccessCodeTable>

export const Content: Story = {
  render: (props, { globals }) => (
    <AccessCodeTable
      {...props}
      deviceId={props.deviceId ?? globals['deviceId']}
    />
  ),
}

export const Issue: Story = {
  render: (props, { globals }) => (
    <AccessCodeTable
      {...props}
      deviceId={props.deviceId ?? globals['deviceId']}
      accessCodeFilter={(accessCode) => accessCode.errors.length > 0}
    />
  ),
}

export const InsideModal: Story = {
  render: (props, { globals }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, toggleOpen] = useToggle()
    return (
      <>
        <Button onClick={toggleOpen}>Open Modal</Button>
        <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
          <div className='seam-components'>
            <AccessCodeTable
              {...props}
              deviceId={props.deviceId ?? globals['deviceId']}
            />
          </div>
        </Dialog>
      </>
    )
  },
}
