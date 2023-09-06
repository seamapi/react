import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { ClimateSettingScheduleDetails } from 'lib/seam/components/ClimateSettingScheduleDetails/ClimateSettingScheduleDetails.js'
import { useToggle } from 'lib/ui/use-toggle.js'

const meta: Meta<typeof ClimateSettingScheduleDetails> = {
  title: 'Components/ClimateSettingScheduleDetails',
  component: ClimateSettingScheduleDetails,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/WTdzEh4CudGdQFOtuVR3Eh/Thermostat%2FNoise-components?type=design&node-id=830-88257&mode=design&t=PEFHm2uapLILRbqf-0',
    },
  },
}

export default meta

type Story = StoryObj<typeof ClimateSettingScheduleDetails>

export const Content: Story = {
  render: (props) => (
    <ClimateSettingScheduleDetails
      {...props}
      climateSettingScheduleId={
        props.climateSettingScheduleId ?? 'climate_setting_schedule1'
      }
    />
  ),
}

export const InsideModal: Story = {
  render: (props) => {
    const [open, toggleOpen] = useToggle()
    return (
      <>
        <Button onClick={toggleOpen}>Open Modal</Button>
        <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
          <div className='seam-components'>
            <ClimateSettingScheduleDetails
              {...props}
              climateSettingScheduleId={
                props.climateSettingScheduleId ?? 'climate_setting_schedule1'
              }
            />
          </div>
        </Dialog>
      </>
    )
  },
}
