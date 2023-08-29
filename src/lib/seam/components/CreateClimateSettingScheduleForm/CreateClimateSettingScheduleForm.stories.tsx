import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { CreateClimateSettingScheduleForm } from 'lib/seam/components/CreateClimateSettingScheduleForm/CreateClimateSettingScheduleForm.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase creating an access code.
 */
const meta: Meta<typeof CreateClimateSettingScheduleForm> = {
  title: 'Example/CreateClimateSettingScheduleForm (Coming Soon)',
  component: CreateClimateSettingScheduleForm,
  tags: ['autodocs'],
  // parameters: {
  //   design: {
  //     type: 'figma',
  //     url: 'https://www.figma.com/file/Su3VO6yupz4yxe88fv0Uqa/Seam-Components?node-id=240%3A37367&mode=dev',
  //   },
  // },
}

export default meta

type Story = StoryObj<typeof CreateClimateSettingScheduleForm>

export const Content: Story = {
  render: (props, { globals }) => (
    <CreateClimateSettingScheduleForm
      {...props}
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
            <CreateClimateSettingScheduleForm
              {...props}
            />
          </div>
        </Dialog>
      </>
    )
  },
}
