import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { EditAccessCodeForm } from 'lib/seam/components/EditAccessCodeForm/EditAccessCodeForm.js'
import { seamComponentsClassName } from 'lib/seam/SeamProvider.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase editing an access code.
 */
const meta: Meta<typeof EditAccessCodeForm> = {
  title: 'Components/EditAccessCodeForm',
  component: EditAccessCodeForm,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Su3VO6yupz4yxe88fv0Uqa/Seam-Components?node-id=240%3A37367&mode=dev',
    },
  },
}

export default meta

type Story = StoryObj<typeof EditAccessCodeForm>

export const Content: Story = {
  render: (props) => (
    <EditAccessCodeForm
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
          <EditAccessCodeForm
            {...props}
            accessCodeId={props.accessCodeId ?? 'access_code1'}
          />
        </Dialog>
      </>
    )
  },
}
