import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { v4 as uuid } from 'uuid'

import AccessCodeDetails, {
  type AccessCodeDetailsProps,
} from 'lib/ui/AccessCodeDetails/AccessCodeDetails.js'
import useToggle from 'lib/use-toggle.js'

const meta: Meta<typeof AccessCodeDetails> = {
  title: 'Example/AccessCodeDetails',
  component: AccessCodeDetails,
  tags: ['autodocs'],
  args: {
    accessCodeId: uuid(),
  },
}

export default meta

type Story = StoryObj<typeof AccessCodeDetails>

export const Content: Story = {}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent(props: AccessCodeDetailsProps) {
  const [showing, toggleShowing] = useToggle()
  // Wrap modal/dialog contents in `seam-components` class
  // to apply styles when rendered in a portal,
  // which is the default MUI behavior.
  return (
    <>
      <Button onClick={toggleShowing}>Open Modal</Button>
      <Dialog open={showing} fullWidth maxWidth='sm' onClose={toggleShowing}>
        <div className='seam-components'>
          <AccessCodeDetails {...props} />
        </div>
      </Dialog>
    </>
  )
}
