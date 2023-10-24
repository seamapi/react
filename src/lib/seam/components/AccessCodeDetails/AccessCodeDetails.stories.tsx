import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { AccessCodeDetails } from 'lib/seam/components/AccessCodeDetails/AccessCodeDetails.js'
import { seamComponentsClassName } from 'lib/seam/SeamProvider.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase access code details.
 */
const meta: Meta<typeof AccessCodeDetails> = {
  title: 'Components/AccessCodeDetails',
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
  render: (props) => (
    <AccessCodeDetails
      {...props}
      accessCodeId={props.accessCodeId ?? 'access_code1'}
    />
  ),
}

export const InsideModal: Story = {
  render: (props) => {
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
          <AccessCodeDetails
            {...props}
            accessCodeId={props.accessCodeId ?? 'access_code1'}
          />
        </Dialog>
      </>
    )
  },
}

export const DisableLockUnlock: Story = {
  render: (props) => (
    <AccessCodeDetails
      {...props}
      accessCodeId={props.accessCodeId ?? 'access_code1'}
      disableLockUnlock
    />
  ),
}
