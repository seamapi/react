import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { seamComponentsClassName } from 'lib/seam/SeamProvider.js'
import { useToggle } from 'lib/ui/use-toggle.js'

import { CreateClimateSettingScheduleForm } from './CreateClimateSettingScheduleForm.js'

/**
 * Coming Soon
 * These stories showcase creating a climate setting schedule.
 */
const meta: Meta<typeof CreateClimateSettingScheduleForm> = {
  title: 'Components/CreateClimateSettingScheduleForm',
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
        <Dialog
          className={seamComponentsClassName}
          open={open}
          fullWidth
          maxWidth='sm'
          onClose={toggleOpen}
        >
          <CreateClimateSettingScheduleForm {...props} />
        </Dialog>
      </>
    )
  },
}
