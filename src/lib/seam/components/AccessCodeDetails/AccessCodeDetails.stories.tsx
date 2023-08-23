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
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Su3VO6yupz4yxe88fv0Uqa/Seam-Components?type=design&node-id=358-43227&mode=design&t=4OQwfRB8Mw8kT1rw-4',
    },
  },
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
