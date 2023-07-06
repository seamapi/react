import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { AccessCodeForm } from 'lib/seam/components/AccessCodeForm/AccessCodeForm.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase access code details.
 */
const meta: Meta<typeof AccessCodeForm> = {
  title: 'Example/AccessCodeAddForm',
  component: AccessCodeForm,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Su3VO6yupz4yxe88fv0Uqa/Seam-Components?node-id=240%3A37367&mode=dev',
    },
  },
}

export default meta

type Story = StoryObj<typeof AccessCodeForm>

export const Content: Story = {
  render: (props, { globals }) => (
    <AccessCodeForm {...props} deviceId={props.deviceId ?? globals.deviceId} />
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
            <AccessCodeForm
              {...props}
              deviceId={props.deviceId ?? globals.deviceId}
            />
          </div>
        </Dialog>
      </>
    )
  },
}
