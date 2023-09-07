import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { CreateAccessCodeForm } from 'lib/seam/components/CreateAccessCodeForm/CreateAccessCodeForm.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * Coming soon.
 */
const meta: Meta<typeof CreateAccessCodeForm> = {
  title: 'Components/CreateAccessCodeForm',
  component: CreateAccessCodeForm,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Su3VO6yupz4yxe88fv0Uqa/Seam-Components?node-id=240%3A37367&mode=dev',
    },
  },
}

export default meta

type Story = StoryObj<typeof CreateAccessCodeForm>

export const Content: Story = {
  render: (props, { globals }) => (
    <CreateAccessCodeForm
      {...props}
      deviceId={props.deviceId ?? globals['deviceId']}
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
            <CreateAccessCodeForm
              {...props}
              deviceId={props.deviceId ?? globals['deviceId']}
            />
          </div>
        </Dialog>
      </>
    )
  },
}
