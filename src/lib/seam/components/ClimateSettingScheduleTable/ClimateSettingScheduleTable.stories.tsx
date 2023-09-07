import { Button, Dialog, DialogActions } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { useToggle } from 'lib/ui/use-toggle.js'

import { ClimateSettingScheduleTable } from './ClimateSettingScheduleTable.js'

const meta: Meta<typeof ClimateSettingScheduleTable> = {
  title: 'Components/ClimateSettingScheduleTable',
  component: ClimateSettingScheduleTable,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/WTdzEh4CudGdQFOtuVR3Eh/Thermostat%2FNoise-components?type=design&node-id=830-88257&mode=design&t=Rfl61v9plkuuCF2h-0',
    },
  },
}

export default meta

type Story = StoryObj<typeof ClimateSettingScheduleTable>

export const Content: Story = {
  render: (props) => (
    <ClimateSettingScheduleTable
      {...props}
      deviceId={props.deviceId ?? 'device5'}
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
            <ClimateSettingScheduleTable
              {...props}
              deviceId={props.deviceId ?? 'device5'}
            />
          </div>
          <DialogActions
            sx={{
              justifyContent: 'center',
            }}
          >
            <Button onClick={toggleOpen}>Done</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  },
}

export const ReadOnlyCustomerSupportPanel: Story = {
  render: (props) => (
    <ClimateSettingScheduleTable
      {...props}
      deviceId={props.deviceId ?? 'device5'}
    />
  ),
}
