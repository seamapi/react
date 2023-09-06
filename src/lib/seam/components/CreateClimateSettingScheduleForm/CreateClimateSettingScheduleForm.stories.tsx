import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { CreateClimateSettingScheduleForm } from 'lib/seam/components/CreateClimateSettingScheduleForm/CreateClimateSettingScheduleForm.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase creating a climate setting schedule
 */
const meta: Meta<typeof CreateClimateSettingScheduleForm> = {
  title: 'Example/CreateClimateSettingScheduleForm (Coming Soon)',
  component: CreateClimateSettingScheduleForm,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/WTdzEh4CudGdQFOtuVR3Eh/Thermostat%2FNoise-components?type=design&node-id=1052-90947&mode=design&t=0A3IQFDW4owsQE0f-0',
    },
  },
}

export default meta

type Story = StoryObj<typeof CreateClimateSettingScheduleForm>

export const Content: Story = {
  render: (props) => <CreateClimateSettingScheduleForm {...props} />,
}

export const InsideModal: Story = {
  render: (props) => {
    const [open, toggleOpen] = useToggle()
    return (
      <>
        <Button onClick={toggleOpen}>Open Modal</Button>
        <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
          <div className='seam-components'>
            <CreateClimateSettingScheduleForm {...props} />
          </div>
        </Dialog>
      </>
    )
  },
}
