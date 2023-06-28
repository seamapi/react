import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { AccessCodeDetails } from 'lib/seam/components/AccessCodeDetails/AccessCodeDetails.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase access code details.
 */
const meta: Meta<typeof AccessCodeDetails> = {
  title: 'Example/AccessCodeDetails',
  component: AccessCodeDetails,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AccessCodeDetails>

export const Content: Story = {
  render: (props, { globals }) => (
    <AccessCodeDetails
      {...props}
      accessCodeId={props.accessCodeId ?? globals['accessCodeId']}
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
            <AccessCodeDetails
              {...props}
              accessCodeId={props.accessCodeId ?? globals['accessCodeId']}
            />
          </div>
        </Dialog>
      </>
    )
  },
}

export const DisableLockUnlock: Story = {
  render: (props, { globals }) => (
    <AccessCodeDetails
      {...props}
      accessCodeId={props.accessCodeId ?? globals['accessCodeId']}
      disableLockUnlock
    />
  ),
}
