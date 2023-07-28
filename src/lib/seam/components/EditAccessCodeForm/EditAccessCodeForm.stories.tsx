import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { EditAccessCodeForm } from 'lib/seam/components/EditAccessCodeForm/EditAccessCodeForm.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase access code details.
 */
const meta: Meta<typeof EditAccessCodeForm> = {
  title: 'Example/EditAccessCodeForm',
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, toggleOpen] = useToggle()
    return (
      <>
        <Button onClick={toggleOpen}>Open Modal</Button>
        <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
          <div className='seam-components'>
            <EditAccessCodeForm
              {...props}
              accessCodeId={props.accessCodeId ?? 'access_code1'}
            />
          </div>
        </Dialog>
      </>
    )
  },
}
